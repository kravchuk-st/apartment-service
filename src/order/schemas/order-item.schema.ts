import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/product/schemas/product.schema';


@Schema({
    versionKey: false
})
export class OrderItem {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: Product.name
    })
    productId: Types.ObjectId

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    })
    creatorId: Types.ObjectId

    @Prop({ required: true, type: String })
    name: string

    @Prop({ type: String, default: null })
    photo: string | null

    @Prop({ type: Number })
    price: number

    @Prop({ type: Number, default: 0 })
    discount: number

    @Prop({ type: Number })
    quantity: number

    @Prop({ type: String })
    size: string

    @Prop({ type: String })
    color: string
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);
export type OrderItemDocument = HydratedDocument<OrderItem>;;