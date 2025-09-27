import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";
import { OrderItemDTO } from "./order-item.dto";
import { PaymentDTO } from "src/payment/dto/payment.dto";
import { PaymentDetailDTO } from "src/payment/dto/create-payment.dto";
import { NullOrString } from "src/decorators/nullOrDate.decorator";
import { ORDER_STATUS } from "src/model/order.model";
import { Types } from "mongoose";

export class CreateOrderDto {

    @IsOptional()
    @IsEnum(ORDER_STATUS)
    status: ORDER_STATUS

    @NullOrString()
    promoCodeId: string | null;

    @IsNotEmpty()
    @IsString()
    phoneNumber: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    totalDiscount: number;

    @IsNumber()
    @Min(0)
    @Type(() => Number)
    totalPrice: number;

    @IsArray()
    @Type(() => OrderItemDTO)
    @ValidateNested({ each: true })
    orders: OrderItemDTO[];

    userId: Types.ObjectId | null;
    creatorId: Types.ObjectId;
    payment: PaymentDetailDTO | null

    constructor(partial: Partial<CreateOrderDto>) {
        Object.assign(this, partial);
    }
}
