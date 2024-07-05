import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import {
  DriverAgeRange,
  DriverGuarantor,
  DriverNextOfKin,
  DriverVehicleField,
  OTPField,
} from '../model/user.model';
import * as mongoose from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'driver',
  toJSON: { getters: true },
})
export class Driver extends AbstractDocument {
  @Prop({ required: false, default: '' })
  firstName: string;

  @Prop({ required: false, default: '' })
  lastName: string;

  @Prop({ required: false, default: '' })
  businessName: string;

  @Prop({
    required: false,
    enum: ['Independent', 'Distributor'],
    default: 'Independent',
  })
  driverType: string;

  @Prop({ required: false, default: '' }) //distributor ID
  employer?: string;

  @Prop({ required: false, default: '' })
  residentialAddress: string;

  @Prop({ default: false })
  firstPasswordReset: boolean;

  @Prop({ required: false, default: '' })
  residentialAddressCoordinates: string;

  @Prop({ required: false, default: '', unique: true })
  email: string;

  @Prop({ required: false, default: '' })
  nin: string;

  @Prop({ enum: ['Active', 'Blocked'], default: 'Active' })
  status: string;

  @Prop({ default: true })
  visible: boolean;

  @Prop({ required: false, default: '', unique: true })
  phone: string;

  @Prop({ required: false, default: '' })
  password: string;

  @Prop({ default: false })
  twoFactorAuthentication: boolean;

  @Prop({ default: '18-24' })
  ageRange: string;

  @Prop({
    required: false,
    default: 'Single',
  })
  maritalStatus: string;

  @Prop({ required: false, default: '' })
  accessToken?: string;

  @Prop({ required: false, default: '' })
  refreshToken?: string;

  @Prop({ required: false, default: '' })
  profilePhoto?: string;

  @Prop({ default: '' })
  profilePhotoPublicID: string;

  @Prop({ default: '' })
  profilePhotoSignature: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  otp?: OTPField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  vehicle?: DriverVehicleField;

  @Prop({ required: false, default: '' })
  driversLicense?: string;

  @Prop({ default: '' })
  driversLicensePublicID: string;

  @Prop({ default: '' })
  driversLicenseSignature: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  guarantor?: DriverGuarantor[];

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  nextOfKin?: DriverNextOfKin;

  @Prop()
  lastLoginTime?: Date;

  @Prop({ required: true, default: false })
  verified?: boolean; //if driver has been onboarded

  @Prop({ required: false, default: '' })
  fcmToken?: string;
}

const DriverSchema = SchemaFactory.createForClass(Driver);
DriverSchema.index({
  firstName: 'text',
  lastName: 'text',
  businessName: 'text',
  email: 'text',
  nin: 'text',
  phone: 'text',
});
export { DriverSchema };
