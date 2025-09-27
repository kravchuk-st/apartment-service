import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { ORDER_STATUS } from 'src/model/order.model';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDto extends PartialType(CreateOrderDto) { }

export class UpdateStatusOrderDto {

    @IsNotEmpty()
    @IsEnum(ORDER_STATUS)
    status: ORDER_STATUS
}