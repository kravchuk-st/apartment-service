import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ProductSizeDTO } from './product-size.dto';
import { ProductColorDTO } from './product-color.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) { }
export class UpdateProductSizeDTO extends PartialType(ProductSizeDTO) { }
export class UpdateProductColorDTO extends PartialType(ProductColorDTO) { }