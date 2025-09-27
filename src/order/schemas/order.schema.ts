import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from "mongoose";
import { OrderItem } from './order-item.schema';
import { ORDER_STATUS } from 'src/model/order.model';
import { User } from 'src/user/schemas/user.schema';
import { PaymentDetail } from 'src/payment/schemas/payment-detail.schema';

@Schema({
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    versionKey: false
})
export class Order {
    _id: string

    @Prop({
        required: true,
        type: String,
        enum: [ORDER_STATUS.CANCEL, ORDER_STATUS.COMPLETE, ORDER_STATUS.PENDING],
        default: ORDER_STATUS.PENDING
    })
    status: ORDER_STATUS;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
        default: null
    })
    userId: Types.ObjectId | null;

    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: User.name,
    })
    creatorId: Types.ObjectId;

    @Prop({ required: true, type: String })
    phoneNumber: string;

    @Prop({ required: true, type: String, default: '' })
    name: string; // order owner name- who is ordered

    @Prop({ default: null, type: String })
    promoCodeId: string | null;

    @Prop({ required: true, type: Number, default: 0 })
    totalDiscount: number;

    @Prop({ required: true, type: Number })
    totalPrice: number;

    @Prop({
        type: [mongoose.Schema.Types.ObjectId],
        ref: OrderItem.name,
        default: []
    })
    orders: Types.ObjectId[]

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: PaymentDetail.name,
        default: null
    })
    payment: Types.ObjectId | null
}

export type OrderDocument = HydratedDocument<Order>;
export const OrderSchema = SchemaFactory.createForClass(Order);