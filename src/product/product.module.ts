import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ProductSize, ProductSizeSchema } from './schemas/product-variants.schema';
import { ProductColor, ProductColorSchema } from './schemas/product-color.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductSize.name, schema: ProductSizeSchema },
      { name: ProductColor.name, schema: ProductColorSchema }
    ])
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService]
})
export class ProductModule { }
