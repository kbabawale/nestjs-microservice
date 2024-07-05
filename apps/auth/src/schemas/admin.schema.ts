import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import { OTPField } from '../model/user.model';
import * as mongoose from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'admin',
  toJSON: { getters: true },
})
export class Adminn extends AbstractDocument {
  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ default: '', unique: true })
  email: string;

  @Prop({ default: '', unique: true })
  phone: string;

  @Prop({ default: '' })
  password: string;

  @Prop({ default: false })
  twoFactorAuthentication: boolean;

  @Prop({ enum: ['Active', 'Blocked'], default: 'Active' })
  status: string;

  @Prop({ required: false, default: '' })
  accessToken?: string;

  @Prop({ required: false, default: true })
  visible?: boolean;

  @Prop({ required: false, default: '' })
  profilePhoto?: string;

  @Prop({ required: false, default: '' })
  refreshToken?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  otp?: OTPField;

  @Prop({ default: new Date() })
  lastLoginTime?: Date;

  @Prop({ required: true, default: '' })
  role?: string;

  @Prop({ required: false, default: '' })
  fcmToken?: string;
}

const AdminnSchema = SchemaFactory.createForClass(Adminn);
AdminnSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
});
export { AdminnSchema };
