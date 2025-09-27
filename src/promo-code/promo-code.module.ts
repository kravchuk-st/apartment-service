import { Module } from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import { PromoCodeController } from './promo-code.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCode, PromoCodeSchema } from './schemas/promo-code.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: PromoCode.name, schema: PromoCodeSchema }])],
  controllers: [PromoCodeController],
  providers: [PromoCodeService],
})
export class PromoCodeModule { }
