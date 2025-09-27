import { Type } from "class-transformer";
import { Min, IsEnum, IsNumber, IsNotEmpty, IsString } from "class-validator";
import { NullOrDate } from "src/decorators/nullOrDate.decorator";
import { Currency, PaymentMethod } from "src/model/payment.model";

export class PaymentDetailDTO {
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    amount: number;

    @IsNotEmpty()
    @IsString()
    orderId: string; // Order ID to which this payment detail belongs

    @IsEnum(Currency)
    currency: string; // e.g., 'USD', 'EUR'

    @IsEnum(PaymentMethod)
    method: PaymentMethod; // 'CASH', 'CARD', etc.

    @IsNumber()
    @IsNotEmpty()
    debt: number;

    @NullOrDate()
    payOffDate: Date | null; // Date when the payment is fully paid off
}
