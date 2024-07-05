import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import { RequestsType } from '../model/user.model';
import * as mongoose from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'adminRequests',
  toJSON: { getters: true },
})
export class AdminRequests extends AbstractDocument {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  type: RequestsType;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  payload: any;

  @Prop({ enum: ['Pending', 'Approved', 'Declined'], default: 'Pending' })
  status: string;

  @Prop({ default: '' })
  approvedBy: string;

  @Prop({ default: '' })
  approvalDate: Date;
}

export const RequestsSchema = SchemaFactory.createForClass(AdminRequests);
