import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import { OTPField } from '../model/user.model';
import * as mongoose from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'distributor',
  toJSON: { getters: true },
})
export class Distributor extends AbstractDocument {
  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ default: '' })
  businessName: string;

  @Prop({ default: '' })
  address: string;

  @Prop({ default: '' })
  addressCoordinates: string;

  @Prop({ default: '', unique: true })
  email: string;

  @Prop({ default: '', unique: true })
  phone: string;

  @Prop({ default: 'storedash' })
  password: string;

  @Prop({ default: '' })
  profilePhoto: string;

  @Prop({ default: '' })
  profilePhotoPublicID: string;

  @Prop({ default: '' })
  profilePhotoSignature: string;

  @Prop({ default: true })
  twoFactorAuthentication: boolean;

  @Prop({ enum: ['Active', 'Blocked'], default: 'Active' })
  status: string;

  @Prop({ default: true })
  visible: boolean;

  @Prop({ default: false })
  firstPasswordReset: boolean;

  @Prop({ required: false, default: '' })
  accessToken?: string;

  @Prop({ required: false, default: '' })
  refreshToken?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  otp?: OTPField;

  @Prop({ default: new Date() })
  lastLoginTime?: Date;

  @Prop({ required: true, default: false })
  verified?: boolean;

  @Prop({ required: false, default: '' })
  fcmToken?: string;

  @Prop({ required: false, default: 5 })
  lowStockAlert?: number;

  @Prop({ required: false, default: 'RANDOM_MIX' }) //INDEPENDENT_DRIVER_ONLY,DISTRIBUTOR_DRIVER_ONLY,RANDOM_MIX
  dispatchOperatorPreference?: string;
}

const DistributorSchema = SchemaFactory.createForClass(Distributor);
DistributorSchema.index({
  firstName: 'text',
  lastName: 'text',
  businessName: 'text',
  email: 'text',
  phone: 'text',
});
export { DistributorSchema };
