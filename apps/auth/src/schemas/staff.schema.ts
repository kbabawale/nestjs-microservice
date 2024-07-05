import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import { DriverVehicleField, OTPField } from '../model/user.model';
import * as mongoose from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'staff',
  toJSON: { getters: true },
})
export class Staff extends AbstractDocument {
  @Prop({ default: '' })
  distributorID: string;

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

  @Prop({ enum: ['Active', 'Blocked'], default: 'Active' })
  status: string;

  @Prop({ default: 'Courier', required: true })
  userType: string;

  @Prop({ required: false, default: '' })
  accessToken?: string;

  @Prop({ required: false, default: true })
  visible?: boolean;

  @Prop({ required: false, default: '' })
  profilePhoto?: string;

  @Prop({ default: '' })
  profilePhotoPublicID?: string;

  @Prop({ default: '' })
  profilePhotoSignature?: string;

  @Prop({ required: false, default: '' })
  refreshToken?: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  otp?: OTPField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  assignedVehicle?: DriverVehicleField;

  @Prop({ default: new Date() })
  lastLoginTime?: Date;

  @Prop({ required: false, default: '' })
  role?: string;

  @Prop({ required: false, default: '' })
  fcmToken?: string;
}

const StaffSchema = SchemaFactory.createForClass(Staff);
StaffSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  phone: 'text',
});
export { StaffSchema };
