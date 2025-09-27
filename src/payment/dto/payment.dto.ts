import { Type } from "class-transformer";
import { IsEnum, IsNumber, Min } from "class-validator";
import { Currency, PaymentMethod, PaymentStatus } from "src/model/payment.model";


export class PaymentDTO {

    @IsNumber()
    @Type(() => Number)
    @Min(0)
    amount: number;

    @IsEnum(Currency)
    currency: Currency; // e.g., 'USD', 'EUR'

    @IsEnum(PaymentMethod)
    method: PaymentMethod; // 'CASH', 'CARD', etc.

    @IsEnum(PaymentStatus)
    status: PaymentStatus
}