import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'otp',
  toJSON: { getters: true },
})
export class OTP extends AbstractDocument {
  @Prop({ default: '', unique: true })
  telephone: string;

  @Prop({ default: '' })
  token: string;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
