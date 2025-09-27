import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { ProductTag } from "src/model/product.model";
type PromoType = ProductTag | 'ALL'
@Schema({
    versionKey: false,
    timestamps: { createdAt: 'createdAt' },
    id: true
})
export class PromoCode {
    id: string

    @Prop({ required: true })
    name: string

    @Prop({
        required: true,
        type: Date
    })
    expireDate: Date

    @Prop({ required: true })
    discount: string

    @Prop({ required: true, type: [String], enum: [ProductTag.DISCOUNT, ProductTag.POPULAR, 'ALL'] })
    type: PromoType[]
}

export type PromoCodeDocument = HydratedDocument<PromoCode>;
export const PromoCodeSchema = SchemaFactory.createForClass(PromoCode);