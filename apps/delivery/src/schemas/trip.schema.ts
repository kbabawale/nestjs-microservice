import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import * as mongoose from 'mongoose';
import {
  DispatchOperatorField,
  TripOrderField,
  TripPinField,
} from '../model/delivery.model';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'trip',
  toJSON: { getters: true },
})
export class Trip extends AbstractDocument {
  @Prop({ required: true, default: 'HEADING_TO_PICKUP' })
  status: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, required: true, default: {} })
  order: TripOrderField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  dispatchOperator: DispatchOperatorField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  pickUpPin: TripPinField;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  dropOffPin?: TripPinField;
}

const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({
  'dispatchOperator.fullname': 'text',
});
export { TripSchema };
