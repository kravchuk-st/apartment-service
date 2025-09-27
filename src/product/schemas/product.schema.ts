import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";

@Schema({
    versionKey: false
})
export class Product {
    _id: Types.ObjectId;

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    price: number

    @Prop({ default: 0 })
    quantity: number

    @Prop({ default: 0 })
    discount: number

    @Prop({ default: [] })
    photo: string[]

    @Prop({ required: true })
    description: string

    @Prop({ type: String })
    category: string

    @Prop({ type: String })
    tag: string

    @Prop({ type: String })
    brand: string

    @Prop({ type: Boolean, default: true })
    isActive: boolean

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'ProductSize', default: [] })
    sizes: Types.ObjectId[]
}

export type ProductDocument = HydratedDocument<Product>;
export const ProductSchema = SchemaFactory.createForClass(Product);