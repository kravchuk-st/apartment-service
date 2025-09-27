import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { InjectModel } from '@nestjs/mongoose';
import { PromoCode, PromoCodeDocument } from './schemas/promo-code.schema';
import { Model } from 'mongoose';

@Injectable()
export class PromoCodeService {
  constructor(
    @InjectModel(PromoCode.name) private readonly promoCodeModel: Model<PromoCodeDocument>
  ) { }

  async create(createPromoCodeDto: CreatePromoCodeDto) {
    try {
      const existingPromo = await this.promoCodeModel.findOne({
        name: createPromoCodeDto.name
      }).exec();

      if (existingPromo && this.compareTime(existingPromo.expireDate, createPromoCodeDto.expireDate)) {
        throw new BadRequestException('Promo code already created!');
      }
      const promoCode = new this.promoCodeModel(createPromoCodeDto);
      return await promoCode.save()
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findAll() {
    try {
      return this.promoCodeModel.find().exec();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      const promoCode = await this.promoCodeModel.findOne({
        name: id
      }).exec();
      if (!promoCode) return new NotFoundException('Promo code not found!');

      const today = new Date();
      const expire = new Date(promoCode.expireDate);
      if (today > expire) {
        return new BadRequestException('Promo code expired!')
      }
      return promoCode;

    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  update(id: number, updatePromoCodeDto: UpdatePromoCodeDto) {
    return `This action updates a #${id} promoCode`;
  }

  remove(id: number) {
    return `This action removes a #${id} promoCode`;
  }

  compareTime(first, second) {
    const time = new Date(first).toISOString()
    const expire = new Date(second).toISOString()
    return time == expire
  }
}
