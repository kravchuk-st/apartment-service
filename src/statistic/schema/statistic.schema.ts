import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

@Schema({
    versionKey: false
})
export class Statistic {
    id: string

    @Prop({ required: true })
    name: string


}

export type StatisticDocument = HydratedDocument<Statistic>;
export const StatisticSchema = SchemaFactory.createForClass(Statistic);