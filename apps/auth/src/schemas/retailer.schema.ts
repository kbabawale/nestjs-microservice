import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import { OTPField, SavedInventoryField } from '../model/user.model';
import * as mongoose from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'retailer',
  toJSON: { getters: true },
})
export class Retailer extends AbstractDocument {
  @Prop({ default: '' })
  firstName: string;

  @Prop({ default: '' })
  lastName: string;

  @Prop({ default: '' })
  businessName?: string;

  @Prop({ default: '' })
  storeAddress?: string;

  @Prop({ default: '' })
  storeAddressCoordinates?: string;

  @Prop({ unique: true })
  email?: string;

  @Prop({ unique: true })
  phone: string;

  @Prop({ default: '' })
  password?: string;

  @Prop({ default: false })
  twoFactorAuthentication?: boolean;

  @Prop({ enum: ['Active', 'Blocked'], default: 'Active' })
  status?: string;

  @Prop({ required: false, default: true })
  visible?: boolean;

  @Prop({ required: false, default: '' })
  accessToken?: string;

  @Prop({ required: false, default: '' })
  profilePhoto?: string;

  @Prop({ default: '' })
  profilePhotoPublicID: string;

  @Prop({ default: '' })
  profilePhotoSignature: string;

  @Prop({ required: false, default: '' })
  refreshToken?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  otp?: OTPField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  wishlist?: SavedInventoryField[];

  @Prop({ default: 0 })
  lastLoginTime?: Date;

  @Prop({ required: true, default: true })
  verified?: boolean;

  @Prop({ required: false, default: '' })
  fcmToken?: string;
}

const RetailerSchema = SchemaFactory.createForClass(Retailer);
RetailerSchema.index({
  firstName: 'text',
  lastName: 'text',
  businessName: 'text',
  email: 'text',
  phone: 'text',
});
export { RetailerSchema };
