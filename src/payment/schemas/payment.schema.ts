import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Currency, PaymentMethod, PaymentStatus } from 'src/model/payment.model';
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from 'src/user/schemas/user.schema';

@Schema({
    versionKey: false,
    timestamps: {
        createdAt: 'createdAt'
    }
})
export class Payment {
    @Prop({ type: Number, default: 0 })
    amount: number

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name
    })
    creatorId: Types.ObjectId

    @Prop({
        enum: PaymentMethod,
        default: PaymentMethod.CASH
    })
    method: PaymentMethod

    @Prop({
        enum: Currency,
        default: Currency.SUM
    })
    currency: Currency;
}

export type PaymentDocument = HydratedDocument<Payment>;
export const PaymentSchema = SchemaFactory.createForClass(Payment);
