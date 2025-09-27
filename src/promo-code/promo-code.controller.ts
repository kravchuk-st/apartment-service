import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, UseGuards } from '@nestjs/common';
import { PromoCodeService } from './promo-code.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ROLE } from 'src/model/role.model';
import ParamsWithId from 'src/helper/param-with-id.dto';
// import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';


@UseGuards(RolesGuard)
@UseGuards(AuthJWTGuard)
@Controller('promo-code')
export class PromoCodeController {
  constructor(private readonly promoCodeService: PromoCodeService) { }

  @Post()
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
  create(@Body(new ValidationPipe()) createPromoCodeDto: CreatePromoCodeDto) {
    return this.promoCodeService.create(createPromoCodeDto);
  }

  @Get()
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
  findAll() {
    return this.promoCodeService.findAll();
  }

  @Get(':id')
  findOne(@Param() { id }: ParamsWithId) {
    return this.promoCodeService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param() {id}: ParamsWithId, @Body() updatePromoCodeDto: UpdatePromoCodeDto) {
  //   return this.promoCodeService.update(+id, updatePromoCodeDto);
  // }

  // @Delete(':id')
  // remove(@Param() {id}: ParamsWithId) {
  //   return this.promoCodeService.remove(+id);
  // }
}
