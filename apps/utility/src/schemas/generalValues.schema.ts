import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';

@Schema({ versionKey: false, timestamps: true, collection: 'GeneralValues' })
export class GeneralValues extends AbstractDocument {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  value: number;
}

export const GeneralValuesSchema = SchemaFactory.createForClass(GeneralValues);
