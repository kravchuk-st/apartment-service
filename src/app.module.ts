import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { PromoCodeModule } from './promo-code/promo-code.module';
import { StatisticModule } from './statistic/statistic.module';
import { SuperUserService } from './super-user/super-user.service';
import { PaymentModule } from './payment/payment.module';
import { ApartmentModule } from './apartment/apartment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({ dest: './uploads' }),
    MongooseModule.forRoot(process.env.MONGO_DB_URL),
    UserModule,
    AuthModule,
    ApartmentModule,
  ],
  providers: [SuperUserService],
})
export class AppModule {}
