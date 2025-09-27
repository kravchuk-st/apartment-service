import { PartialType } from '@nestjs/mapped-types';
import { PaymentDetailDTO } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(PaymentDetailDTO) { }
