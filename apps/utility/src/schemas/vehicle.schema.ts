import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';

@Schema({ versionKey: false, timestamps: true, collection: 'vehicle' })
export class Vehicle extends AbstractDocument {
  @Prop()
  make: string;

  @Prop()
  model: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
