import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { ApartmentService } from './apartment.service';
import { CreateApartmentDto, favoriteDto } from './dto/create-apartment.dto';
import { UpdateApartmentDto } from './dto/update-apartment.dto';
import { JWTPayload } from 'src/model/auth.model';
import { Roles } from 'src/decorators/role.decorator';
import { ROLE } from 'src/model/role.model';
import { User } from 'src/decorators/user.decorator';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import {
  QueryWithCityPriceGuests,
  FavoritesQuery,
} from 'src/helper/apartment-query.dto';
import ParamsWithId from 'src/helper/param-with-id.dto';
import { fileUploadInterceptor } from './interceptor/file-upload.interceptor';
import { RolesGuard } from 'src/guards/role.guard';

@Controller('apartment')
export class ApartmentController {
  constructor(private readonly apartmentService: ApartmentService) {}

  @UseGuards(AuthJWTGuard)
  @Get('favorite')
  findAllFavorites(@Query() dto: FavoritesQuery, @User() payload: JWTPayload) {
    return this.apartmentService.findFavorites(dto, payload);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Post('favorite')
  addToFavorite(
    @Body(
      new ValidationPipe({
        transform: true,
      }),
    )
    favorite: favoriteDto,
    @User() payload: JWTPayload,
  ) {
    return this.apartmentService.addToFavorite(favorite, payload);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Patch('favorite')
  removeFromFavorite(
    @Body(
      new ValidationPipe({
        transform: true,
      }),
    )
    favorite: favoriteDto,
    @User() payload: JWTPayload,
  ) {
    return this.apartmentService.removeFromFavorite(favorite, payload);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Post()
  create(
    @Body(
      new ValidationPipe({
        transform: true,
      }),
    )
    createApartmentDto: CreateApartmentDto,
    @User() payload: JWTPayload,
  ) {
    return this.apartmentService.createApartment(createApartmentDto, payload);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Roles(ROLE.ADMIN, ROLE.MANAGER, ROLE.USER)
  @Post('upload-photo')
  @UseInterceptors(fileUploadInterceptor)
  uploadPhoto(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 7 * 1024 * 1024 }), //7MB
          new FileTypeValidator({ fileType: /^image\/(png|jpeg)$/ }),
        ],
        exceptionFactory(error) {
          if (error.includes('type')) {
            throw new BadRequestException('File type is not image!');
          } else if (error.includes('size')) {
            throw new BadRequestException('File size is big than 7MB!');
          } else {
            throw new BadRequestException(error);
          }
        },
        fileIsRequired: false,
      }),
    )
    photo: Array<Express.Multer.File>,
  ) {
    return this.apartmentService.handleFile(photo);
  }

  @Get()
  findAll(
    @Query()
    { city, price, maxGuests, page, limit }: QueryWithCityPriceGuests,
  ) {
    return this.apartmentService.findAll({
      city,
      price,
      maxGuests,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param() { id }: ParamsWithId) {
    return this.apartmentService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateApartmentDto: UpdateApartmentDto,
  ) {
    return this.apartmentService.update(id, updateApartmentDto);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Roles(ROLE.ADMIN, ROLE.MANAGER, ROLE.USER)
  @Delete(':id')
  remove(@Param() { id }: ParamsWithId) {
    return this.apartmentService.remove(id);
  }
}
