import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Types } from "mongoose";
import { NullOrString } from "src/decorators/nullOrDate.decorator";


export class OrderItemDTO {
    @IsNotEmpty()
    @IsString()
    name: string

    @NullOrString()
    photo: string | null

    @IsNotEmpty()
    @IsString()
    productId: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    price: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    discount: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    quantity: number


    @IsNotEmpty()
    @IsString()
    size: string

    @IsNotEmpty()
    @IsString()
    color: string

    creatorId: Types.ObjectId

    constructor(partial: Partial<OrderItemDTO>) {
        Object.assign(this, partial);
    }
}