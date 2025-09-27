import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ROLE } from 'src/model/role.model';
import { GENDER } from 'src/model/gender.model';

@Schema({
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  id: true,
  versionKey: false,
})
export class User {
  id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true, minlength: 3 })
  password: string;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ enum: ROLE, default: ROLE.USER })
  role: ROLE;

  @Prop({ default: '' })
  phone: string;

  @Prop({ enum: GENDER })
  gender: GENDER;

  @Prop({ default: '' })
  aboutMe: string;

  @Prop({ type: Date })
  birthDate: Date;

  @Prop({ default: [] })
  interests: string[];

  @Prop({ default: [] })
  myLanguages: string[];

  @Prop({ default: [] })
  myCountries: string[];
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
