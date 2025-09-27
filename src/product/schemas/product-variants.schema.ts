import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

@Schema({
    versionKey: false,
    timestamps: { createdAt: 'createdAt' },
})
export class ProductSize {
    _id: Types.ObjectId

    @Prop({ type: String })
    size: string;

    @Prop({ required: true, type: Number })
    quantity: number;

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'ProductColor', default: [] })
    colors: Types.ObjectId[]
}

export type ProductSizeDocument = HydratedDocument<ProductSize>;
export const ProductSizeSchema = SchemaFactory.createForClass(ProductSize);