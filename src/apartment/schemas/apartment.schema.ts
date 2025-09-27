import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { PROPERTY } from 'src/model/property.model';

@Schema({
  versionKey: false,
  _id: false,
})
export class AccessibleEnvironment {
  @Prop({ default: false })
  wifi: boolean;

  @Prop({ default: false })
  tv: boolean;

  @Prop({ default: false })
  kitchen: boolean;

  @Prop({ default: false })
  washer: boolean;

  @Prop({ default: false })
  airConditioning: boolean;

  @Prop({ default: false })
  parking: boolean;
}

@Schema({
  versionKey: false,
  _id: false,
})
export class Amenities {
  @Prop({ default: false })
  pool: boolean;

  @Prop({ default: false })
  piano: boolean;

  @Prop({ default: false })
  beachAccess: boolean;

  @Prop({ default: false })
  gym: boolean;

  @Prop({ default: false })
  billiards: boolean;

  @Prop({ default: false })
  grill: boolean;
}

@Schema({
  versionKey: false,
  _id: false,
})
export class SafetyFeatures {
  @Prop({ default: false })
  smokeDetector: boolean;

  @Prop({ default: false })
  fireExtinguisher: boolean;

  @Prop({ default: false })
  firstAidKit: boolean;

  @Prop({ default: false })
  securitySystem: boolean;
}

@Schema({
  versionKey: false,
})
export class Apartment {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  descr: string;

  @Prop({ default: [] })
  photo: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ enum: PROPERTY })
  propertyType: PROPERTY;

  @Prop({ type: String })
  country: string;

  @Prop({ type: String })
  city: string;

  @Prop({ type: String })
  street: string;

  @Prop({ type: String })
  building: string;

  @Prop({ type: Number })
  maxGuests: number;

  @Prop({ type: Number })
  bedrooms: number;

  @Prop({ type: Number })
  beds: number;

  @Prop({ type: Number })
  bathrooms: number;

  @Prop({ default: [] })
  favorites: string[];

  @Prop({ type: AccessibleEnvironment })
  accessibleEnvironment: AccessibleEnvironment;

  @Prop({ type: Amenities })
  amenities: Amenities;

  @Prop({ type: SafetyFeatures })
  safetyFeatures: SafetyFeatures;
}

export type ApartmentDocument = HydratedDocument<Apartment>;
export const ApartmentSchema = SchemaFactory.createForClass(Apartment);
