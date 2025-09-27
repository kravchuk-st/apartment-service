import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { ROLE } from 'src/model/role.model';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import { User } from 'src/decorators/user.decorator';
import { JWTPayload } from 'src/auth/models/auth.model';
import ParamsWithId from 'src/helper/param-with-id.dto';

@UseGuards(RolesGuard)
@UseGuards(AuthJWTGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
  findAll(@User() payload: JWTPayload) {
    return this.userService.findAll(payload);
  }

  @Get(':id')
  findOne(@Param() { id }: ParamsWithId) {
    return this.userService.findOneById(id);
  }

  @Patch(':id')
  @Roles(ROLE.ADMIN, ROLE.MANAGER, ROLE.USER)
  update(
    @Param() { id }: ParamsWithId,
    @Body(new ValidationPipe()) updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(ROLE.ADMIN)
  remove(@Param() { id }: ParamsWithId) {
    return this.userService.remove(id);
  }
}
