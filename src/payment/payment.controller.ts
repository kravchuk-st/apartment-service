import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDetailDTO } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ROLE } from 'src/model/role.model';
import { User } from 'src/decorators/user.decorator';
import { JWTPayload } from 'src/model/auth.model';
import { PaymentDTO } from './dto/payment.dto';


@UseGuards(RolesGuard)
@UseGuards(AuthJWTGuard)
@Roles(ROLE.ADMIN, ROLE.MANAGER)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post(':id')
  createPayment(
    @Param('id') id: string,
    @Body() createPaymentDto: PaymentDTO,
    @User() payload: JWTPayload
  ) {
    return this.paymentService.createPayment(id, createPaymentDto, payload);
  }

  @Post()
  createPaymentDetail(
    @Body() createPaymentDto: PaymentDetailDTO,
    @User() payload: JWTPayload
  ) {
    return this.paymentService.createPaymentDetail(createPaymentDto, payload);
  }

  @Get()
  findAll() {
    return this.paymentService.findAllPaymentDetails();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(+id, updatePaymentDto);
  }
}
