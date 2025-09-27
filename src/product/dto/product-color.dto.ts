import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, Min } from "class-validator";
import { Types } from "mongoose";
import { ProductColor } from "src/model/product.model";



export class ProductColorDTO {
    @IsString()
    @IsNotEmpty() // Обязательное поле
    color: string;

    @IsNumber()
    @Type(() => Number)
    @Min(0)
    @IsNotEmpty() // Обязательное поле
    stock: number;

    sold: number = 0;
    userId?: Types.ObjectId
    productId?: Types.ObjectId
    sizeId?: Types.ObjectId
    constructor(obj: Omit<ProductColor, '_id'>) {
        Object.assign(this, obj);
    }
}