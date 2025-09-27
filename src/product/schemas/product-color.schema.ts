import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

@Schema({
    versionKey: false,
    timestamps: { createdAt: 'createdAt' },
})
export class ProductColor {
    _id: Types.ObjectId;

    @Prop({ type: String, required: true })
    color: string;

    @Prop({ type: Number, default: 0 })
    stock: number;

    @Prop({ type: Number, default: 0 })
    sold: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true })
    productId: Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductSize', required: true })
    sizeId: Types.ObjectId;
}

export type ProductColorDocument = HydratedDocument<ProductColor>;
export const ProductColorSchema = SchemaFactory.createForClass(ProductColor);