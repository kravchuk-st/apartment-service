import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  Put,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductSizeDTO } from './dto/update-product.dto';
import { AuthJWTGuard } from 'src/auth/guard/auth.guard';
import { Roles } from 'src/decorators/role.decorator';
import { RolesGuard } from 'src/guards/role.guard';
import { ROLE } from 'src/model/role.model';
import { fileUploadInterceptor } from './interceptor/file-upload.interceptor';
import { ValidateSizePipe } from './pipe/validate-variants.pipe';
import { JWTPayload } from 'src/model/auth.model';
import { User } from 'src/decorators/user.decorator';
import ParamsWithId from 'src/helper/param-with-id.dto';
import { PaginationParams } from 'src/helper/pagination-params.dto';
import QueryWithSizeAndColor from 'src/helper/product-size-color.dto';
import e from 'express';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
  @Post()
  create(
    @Body(
      new ValidateSizePipe(),
      new ValidationPipe({
        transform: true,
      }),
    )
    createProductDto: CreateProductDto,
    @User() payload: JWTPayload,
  ) {
    return this.productService.createProduct(createProductDto, payload);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
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
    return this.productService.handleFile(photo);
  }

  @Get()
  findAll(@Query() { page, limit }: PaginationParams) {
    return this.productService.findAll(page, limit);
  }

  @Get('search')
  search(@Query('text') text: string) {
    return this.productService.findByNameOrBrand(text);
  }

  @Get(':id')
  findOne(
    @Param() { id }: ParamsWithId,
    @Query() { color, size }: QueryWithSizeAndColor,
  ) {
    return this.productService.findOne(id, { color, size });
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
  @Delete(':id')
  remove(@Param() { id }: ParamsWithId) {
    return this.productService.remove(id);
  }

  @UseGuards(RolesGuard)
  @UseGuards(AuthJWTGuard)
  @Roles(ROLE.ADMIN, ROLE.MANAGER)
  @Put(':id')
  update(
    @Param() { id }: ParamsWithId,
    @Body(
      new ValidateSizePipe(),
      new ValidationPipe({
        transform: true,
      }),
    )
    updateProductDto: CreateProductDto,
  ) {
    return this.productService.updateProduct(id, updateProductDto);
  }

  // @UseGuards(RolesGuard)
  // @UseGuards(AuthJWTGuard)
  // @Roles(ROLE.ADMIN, ROLE.MANAGER)
  // @Patch(':id')
  // updateProductSize(@Param() { id }: ParamsWithId, @Body() updateProductDto: UpdateProductSizeDTO) {
  //   return this.productService.updateProductSize(id, updateProductDto);
  // }
}
