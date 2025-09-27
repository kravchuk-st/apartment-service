import { Type } from "class-transformer";
import { IsArray, IsDate, IsDateString, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ProductTag } from "src/model/product.model";

type PromoType = ProductTag | 'ALL'

export class CreatePromoCodeDto {

    @IsString()
    @IsNotEmpty()
    name: string

    @IsDateString()
    @IsNotEmpty()
    expireDate: Date

    @IsString()
    @IsNotEmpty()
    discount: string


    @IsDate()
    @IsOptional()
    createdAt: string

    @IsArray()
    @Type(() => String)
    @IsNotEmpty()
    type: PromoType[]

}
