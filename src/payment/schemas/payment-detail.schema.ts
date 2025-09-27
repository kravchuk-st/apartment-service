import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentStatus } from 'src/model/payment.model';
import mongoose, { HydratedDocument, Types } from "mongoose";
import { Payment } from './payment.schema';

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: 'createdAt'
    }
})
export class PaymentDetail {
    _id: Types.ObjectId

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: Payment.name
    })
    orderId: Types.ObjectId

    @Prop({
        required: true,
        type: [mongoose.Schema.Types.ObjectId],
        ref: Payment.name,
        default: []
    })
    paid: Types.ObjectId[]

    @Prop({ type: Number, default: 0 })
    debt: number

    @Prop({ type: Number, default: 0 })
    amount: number

    @Prop({
        enum: PaymentStatus,
        default: PaymentStatus.PAID
    })
    status: PaymentStatus

    @Prop({ type: Date, default: null })
    payOffDate: Date | null
}

export type PaymentDetailDocument = HydratedDocument<PaymentDetail>;
export const PaymentDetailSchema = SchemaFactory.createForClass(PaymentDetail);
