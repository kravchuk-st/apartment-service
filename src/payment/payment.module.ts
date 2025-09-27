import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentDetail, PaymentDetailSchema } from './schemas/payment-detail.schema';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentDetail.name, schema: PaymentDetailSchema },
      { name: Payment.name, schema: PaymentSchema }

    ]),
    OrderModule
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
