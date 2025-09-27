import {
  IsEnum,
  IsString,
  MaxLength,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ROLE } from 'src/model/role.model';
import { GENDER } from 'src/model/gender.model';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEnum(ROLE)
  role: ROLE;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEnum(GENDER)
  gender?: GENDER;

  @IsOptional()
  @IsString()
  @MaxLength(450)
  aboutMe?: string;

  @IsDate()
  @Type(() => Date)
  birthday?: Date;

  @IsOptional()
  @IsArray()
  interests?: string[];

  @IsOptional()
  @IsArray()
  myLanguages?: string[];

  @IsOptional()
  @IsArray()
  myCountries?: string[];

  constructor(obj: Partial<CreateUserDto>) {
    this.role = ROLE.USER;
    Object.assign(this, obj);
  }
}
