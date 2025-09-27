import { ForbiddenException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductSizeDTO } from './dto/product-size.dto';
import { ProductColorDTO } from './dto/product-color.dto';
import { Product, ProductDocument } from './schemas/product.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model, Types } from 'mongoose';
import { ProductSize, ProductSizeDocument } from './schemas/product-variants.schema';
import { FileHelper } from 'src/helper/file.helper';
import { JWTPayload } from 'src/model/auth.model';
import { ProductColor, ProductColorDocument } from './schemas/product-color.schema';
import { ProductSold } from 'src/model/product.model';
import QueryWithSizeAndColor from 'src/helper/product-size-color.dto';
import { isMongoDbId } from 'src/helper/validator';

@Injectable()
export class ProductService implements OnModuleInit {

  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(ProductSize.name) private readonly productSizeModel: Model<ProductSizeDocument>,
    @InjectModel(ProductColor.name) private readonly productColorModel: Model<ProductColorDocument>,
    @InjectConnection() private readonly connection: Connection
  ) { }

  async onModuleInit() {
    await this.updateOldDocuments();
  }

  async createProduct({ sizes, ...createProductDto }: CreateProductDto, payload: JWTPayload) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const productModel = new this.productModel(createProductDto);

      const id = productModel._id.toString();
      const productId = new Types.ObjectId(id);
      const userId = new Types.ObjectId(payload.userId);

      if (sizes && sizes.length) {
        const {
          quantity,
          productSizeIds
        } = await this.workWithProductSizes({ sizes, productId, userId }, session);
        productModel.sizes.push(...productSizeIds);
        productModel.quantity = quantity;
      }

      const newProduct = await productModel.save({ session });
      await session.commitTransaction();
      return newProduct;
    } catch (error) {
      await session.abortTransaction();
      throw new ForbiddenException(error?.message);
    } finally {
      await session.endSession();
    }
  }

  async workWithProductSizes({ sizes, productId, userId }: { sizes: ProductSizeDTO[], productId: Types.ObjectId, userId: Types.ObjectId }, session: ClientSession) {
    try {
      let quantity = 0;
      const productSizeIds: ProductSizeDocument[] = [];
      const productColorIds: ProductColorDocument[] = [];

      for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        quantity += size.quantity;
        const productDTO = new ProductSizeDTO({ ...size, colors: [] });

        const newSize = new this.productSizeModel(productDTO)

        productSizeIds.push(newSize);

        for (let j = 0; j < size.colors.length; j++) {
          const color = size.colors[j];
          const colorDTO = new ProductColorDTO({
            color: color.color,
            stock: color.stock,
            userId: userId,
            productId: productId,
            sizeId: newSize._id,
            sold: 0,
          });
          const newColor = new this.productColorModel(colorDTO);
          newSize.colors.push(newColor._id);
          productColorIds.push(newColor);
        }
      }
      // Сохраняем размеры и цвета в базе данных
      await this.productColorModel.insertMany(productColorIds, { session });
      await this.productSizeModel.insertMany(productSizeIds, { session });

      // Обновляем массив размеров в каждом новом размере
      return {
        quantity,
        productSizeIds: productSizeIds.map(size => size._id)
      }
    } catch (error) {
      throw new ForbiddenException('Product sizes creating error: ' + error?.message);
    }
  }

  async findAll(documentsToSkip = 0, limitOfDocuments?: number) {
    try {
      const query = this.productModel.find({ isActive: true }).sort({ _id: 1 }).skip(documentsToSkip).populate<{ sizes: ProductSize }>('sizes');
      if (limitOfDocuments) {
        query.limit(limitOfDocuments);
      }
      const result = await query.exec();
      const count = await this.productModel.countDocuments({ isActive: true }).exec();
      return {
        result,
        count,
      };
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  async findOne(id: string, dto?: QueryWithSizeAndColor) {
    const populateOptions = this.makePopulateOptions(dto);
    try {
      const product = await this.productModel.findById(id)
        .populate<{ sizes: ProductSize }>(populateOptions)
        .exec();
      if (!product) throw new NotFoundException('Product not found');
      return product;
    } catch (error) {
      throw new ForbiddenException('Product not found: ' + error?.message);
    }
  }

  async findByNameOrBrand(text: string) {
    const product = await this.productModel.find({
      $or: [
        {
          brand: { '$regex': text, '$options': 'i' }
        },
        {
          name: { '$regex': text, '$options': 'i' }
        },
      ]
    }).populate({
      path: 'sizes',
      populate: {
        path: 'colors'
      }
    });
    return product;
  }

  async updateProduct(id: string, { sizes, ...dto }: CreateProductDto) {

    // const session = await this.connection.startSession();

    // try {
    //   session.startTransaction();

    //   // Обновляем продукт
    //   await this.productModel.findByIdAndUpdate(id, dto, { session });

    //   // Обновляем или создаем варианты
    //   for (const size of sizes || []) {
    //     if (size._id) {
    //       // Если _id есть, обновляем существующий вариант
    //       const updsize = await this.productSizeModel.updateOne(
    //         { _id: new Types.ObjectId(size._id) },
    //         { $set: size },
    //         { session }
    //       );
    //     } else {
    //       // Если _id нет, создаем новый вариант
    //       const newSize = await new this.productSizeModel(size).save({ session });
    //     }
    //   }

    //   await session.commitTransaction();

    //   return this.findOne(id);
    // } catch (error) {
    //   await session.abortTransaction();
    //   throw new ForbiddenException('Product updating error: ' + error?.message);
    // } finally {
    //   await session.endSession();
    // }
  }

  // async updateProductSize(id: string, sizes: UpdateProductSizeDTO) {
  //   try {
  //     const productId = new Types.ObjectId(id);
  //     const productsizes = await this.productSizeModel.find({
  //       productId
  //     }).exec();
  //     return productsizes
  //   } catch (error) {
  //     throw new ForbiddenException('Product sizes updating error: ' + error?.message);
  //   }
  // }

  async remove(id: string) {
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const productId = new Types.ObjectId(id);
      await this.productModel.findOneAndUpdate(productId,
        {
          isActive: false
        },
        {
          session
        }
      )

      await session.commitTransaction();
      return true
    } catch (error) {
      await session.abortTransaction();

      throw new ForbiddenException('Failed to delete product: ' + error?.message);
    } finally {
      await session.endSession();
    }

  }

  async productSold(dto: ProductSold, session: ClientSession) {

    try {
      const productColor = await this.productColorModel.findByIdAndUpdate(dto.colorId, {
        $inc: {
          sold: dto.quantity,
          stock: -dto.quantity
        }
      }, { new: true, session }).exec();

      const productSize = await this.productSizeModel.findByIdAndUpdate(dto.sizeId, {
        $inc: {
          quantity: -dto.quantity
        }
      }, { new: true, session }).exec();

      const product = await this.productModel.findByIdAndUpdate(dto.productId, {
        $inc: {
          quantity: -dto.quantity
        }
      }, { new: true, session }).exec();

      return Promise.all([productColor, productSize, product]);

    } catch (error) {
      throw new Error(`Error selling product: ${error.message}`);
    }
  }



  async handleFile(files: Express.Multer.File[]) {
    try {
      const compressedPhotos = await Promise.all(
        files.map(async (file) => {
          const fileName = FileHelper.createFileName(file);
          const originalBuffer = await FileHelper.compressImage(file); // Читаем файл в память
          FileHelper.writeFile(fileName, originalBuffer);
          return `/static/${fileName}`; // Возвращаем ссылку
        })
      );
      return compressedPhotos
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  private async updateOldDocuments() {
    // try {
    //   console.log('Updating old documents...');

    //   // Update all documents to include the new property if they don't have it already.
    //   await this.productModel.updateMany(
    //     { isActive: { $exists: false } }, // Only update documents missing `newProp`.
    //     { $set: { isActive: true } } // Set a default value for the new property.
    //   );

    //   console.log('Old documents updated successfully.');
    // } catch (error) {
    //   console.error('Error updating old data:', error);
    // }
  }

  private makePopulateOptions(dto?: QueryWithSizeAndColor) {
    const size = isMongoDbId(dto?.size) ? { _id: dto?.size } : { size: dto?.size };
    const color = isMongoDbId(dto?.color) ? { _id: dto?.color } : { color: dto?.color };
    const populateOptions = {
      path: 'sizes', // Связываем размеры
      match: dto?.size ? size : undefined, // Если sizeId есть, то фильтруем по нему, 
      populate: {
        path: 'colors', // Связываем цвета внутри размеров
        match: dto?.color ? color : undefined, // Фильтруем только те цвета, которые соответствуют colorId
      }
    }
    return populateOptions;
  }
}
