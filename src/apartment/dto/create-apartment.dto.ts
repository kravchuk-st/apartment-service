import { Type } from 'class-transformer';
import {
  IsEnum,
  IsString,
  IsNumber,
  IsNotEmpty,
  IsArray,
  Min,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { PROPERTY } from 'src/model/property.model';

export class AccessibleEnvironmentDto {
  @IsNotEmpty()
  @IsBoolean()
  wifi: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  tv: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  kitchen: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  washer: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  airConditioning: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  parking: boolean = false;
}

export class AmenitiesDto {
  @IsNotEmpty()
  @IsBoolean()
  pool: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  piano: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  beachAccess: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  gym: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  billiards: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  grill: boolean = false;
}

export class SafetyFeaturesDto {
  @IsNotEmpty()
  @IsBoolean()
  smokeDetector: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  fireExtinguisher: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  firstAidKit: boolean = false;

  @IsNotEmpty()
  @IsBoolean()
  securitySystem: boolean = false;
}

export class CreateApartmentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  descr: string;

  @IsNotEmpty()
  @IsArray()
  photo?: string[] = [];

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  @IsEnum(PROPERTY)
  propertyType: PROPERTY;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNotEmpty()
  @IsString()
  building: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  maxGuests: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  bedrooms: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  beds: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  @IsNotEmpty()
  bathrooms: number;

  @ValidateNested()
  @Type(() => AccessibleEnvironmentDto)
  accessibleEnvironment?: AccessibleEnvironmentDto;

  @ValidateNested()
  @Type(() => AmenitiesDto)
  amenities?: AmenitiesDto;

  @ValidateNested()
  @Type(() => SafetyFeaturesDto)
  safetyFeatures?: SafetyFeaturesDto;
}

export class favoriteDto {
  @IsNotEmpty()
  @IsString()
  apartmentId: string;
}
