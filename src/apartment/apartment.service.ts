import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateApartmentDto, favoriteDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { Apartment, ApartmentDocument } from './schemas/apartment.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import {
  QueryWithCityPriceGuests,
  FavoritesQuery,
} from 'src/helper/apartment-query.dto';
import { FileHelper } from 'src/helper/file.helper';
import { JWTPayload } from 'src/model/auth.model';

@Injectable()
export class ApartmentService {
  constructor(
    @InjectModel(Apartment.name)
    private readonly apartmentModel: Model<ApartmentDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async createApartment(dto: CreateApartmentDto, payload: JWTPayload) {
    try {
      if (!payload.userId) {
        throw new ForbiddenException('User not authenticated');
      }

      const apartmentModel = new this.apartmentModel(dto);
      const newApartment = await apartmentModel.save();
      return newApartment;
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  async findAll(dto?: QueryWithCityPriceGuests) {
    try {
      const page = dto?.page || 1;
      const limit = dto?.limit || 50;
      const skip = (page - 1) * limit;
      const filter = this.buildFilter(dto);

      const apartments = await this.apartmentModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .exec();

      if (!apartments || apartments.length === 0) {
        return [];
      }

      return apartments;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ForbiddenException('Apartment not found: ' + error?.message);
    }
  }

  async findOne(id: string) {
    try {
      const apartment = await this.apartmentModel.findById(id).exec();
      if (!apartment) throw new NotFoundException('Apartment not found');
      return apartment;
    } catch (error) {
      throw new ForbiddenException('Apartment not found: ' + error?.message);
    }
  }

  update(id: string, updateApartmentDto: UpdateApartmentDto) {
    return `This action updates a #${id} apartment`;
  }

  remove(id: string) {
    try {
      const apartment = this.apartmentModel.findByIdAndDelete(id);
      return true;
    } catch (error) {
      throw new ForbiddenException('Apartment not found: ' + error?.message);
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
        }),
      );
      return compressedPhotos;
    } catch (error) {
      throw new ForbiddenException(error?.message);
    }
  }

  async findFavorites(dto: FavoritesQuery, payload: JWTPayload) {
    try {
      const page = dto?.page || 1;
      const limit = dto?.limit || 50;
      const skip = (page - 1) * limit;
      const userId = payload?.userId;
      if (!userId) {
        throw new ForbiddenException('User not authenticated');
      }

      const apartments = await this.apartmentModel
        .find()
        .skip(skip)
        .limit(limit)
        .exec();

      return apartments.filter((apartment) =>
        apartment.favorites.includes(userId),
      );
    } catch (error) {
      throw new ForbiddenException('Favorites not found: ' + error?.message);
    }
  }

  async addToFavorite(favorite: favoriteDto, payload: JWTPayload) {
    try {
      const apartment = await this.findOne(favorite.apartmentId);
      if (!apartment.favorites.includes(payload.userId)) {
        apartment.favorites.push(payload.userId);
        await this.apartmentModel.updateOne(
          { _id: apartment._id },
          { $set: apartment },
        );
      }
      return apartment;
    } catch (error) {
      throw new NotFoundException('Apartment not found: ' + error?.message);
    }
  }

  async removeFromFavorite(favorite: favoriteDto, payload: JWTPayload) {
    try {
      console.log(favorite);

      const apartment = await this.findOne(favorite.apartmentId);
      apartment.favorites = apartment.favorites.filter(
        (userId) => userId !== payload.userId,
      );
      await this.apartmentModel.updateOne(
        { _id: apartment._id },
        { $set: apartment },
      );
      return apartment;
    } catch (error) {
      throw new NotFoundException('Apartment not found: ' + error?.message);
    }
  }

  private buildFilter(dto?: QueryWithCityPriceGuests) {
    const filter: any = {};

    if (dto?.city) {
      filter.city = { $regex: dto.city.trim(), $options: 'i' };
    }

    if (dto?.price) {
      filter.price = { $lte: Number(dto.price) };
    }

    if (dto?.maxGuests) {
      filter.maxGuests = { $gte: dto.maxGuests };
    }

    return filter;
  }
}
