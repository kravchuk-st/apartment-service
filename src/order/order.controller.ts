import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ValidationPipe, ParseIntPipe } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, UpdateStatusOrderDto } from './dto/update-order.dto';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { JWTPayload } from 'src/auth/models/auth.model';
import { Roles } from 'src/decorators/role.decorator';
import { ROLE } from 'src/model/role.model';
import { RolesGuard } from 'src/guards/role.guard';
import ParamsWithId from 'src/helper/param-with-id.dto';

@UseGuards(AuthJWTGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post()
  create(@Body(new ValidationPipe()) createOrderDto: CreateOrderDto, @User() payload: JWTPayload) {
    return this.orderService.create(createOrderDto, payload);
  }

  @Get()
  findAll(@User() payload: JWTPayload) {
    return this.orderService.findAll(payload);
  }

  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
  @Get('all')
  getAll() {
    return this.orderService.getAll();
  }

  @Get(':id')
  findOne(@Param() { id }: ParamsWithId, @User() payload: JWTPayload) {
    return this.orderService.findOne(id, payload);
  }

  // @UseGuards(RolesGuard)
  // @Roles(ROLE.ADMIN, ROLE.MANAGER)
  // @Patch(':id/status')
  // updateStatus(
  //   @Param('id', ParseIntPipe) id: string,
  //   @Body(new ValidationPipe()) updateOrderDto: UpdateStatusOrderDto,
  //   @User() payload: JWTPayload
  // ) {
  //   return this.orderService.updateStatus(id, updateOrderDto, payload);
  // }

  @UseGuards(RolesGuard)
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string, @User() payload: JWTPayload) {
    return this.orderService.remove(id, payload);
  }
}
