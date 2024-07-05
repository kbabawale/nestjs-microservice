import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import * as mongoose from 'mongoose';
import { AccompanyingDocumentField } from '../model/delivery.model';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'vehicle',
  toJSON: { getters: true },
})
export class Vehicle extends AbstractDocument {
  @Prop({ required: true, default: true })
  visible: boolean;

  @Prop({ required: true, default: true })
  published: boolean;

  @Prop({ required: true, default: '' })
  model: string;

  @Prop({ required: true, default: '' })
  distributorID: string;

  @Prop({ required: true, default: '' })
  make: string;

  @Prop({ required: false, default: '' })
  notes: string;

  @Prop({ required: true, default: '' })
  numberPlate: string;

  @Prop({ required: true, default: '' })
  color: string;

  @Prop({ required: false, default: '' })
  year: string;

  @Prop({ required: false, default: '' })
  VIN: string;

  @Prop({ required: false, default: '' })
  registration: string;

  @Prop({ required: false, default: [] })
  images: string[];

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  accompanyingDocuments: AccompanyingDocumentField[];
}

const VehicleSchema = SchemaFactory.createForClass(Vehicle);
VehicleSchema.index({
  model: 'text',
  year: 'text',
  make: 'text',
  numberPlate: 'text',
  color: 'text',
  VIN: 'text',
  registration: 'text',
});
export { VehicleSchema };
