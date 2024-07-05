import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';

@Schema({ versionKey: false, timestamps: true, collection: 'google' })
export class GoogleCountries extends AbstractDocument {
  @Prop({ unique: true })
  name: string;

  @Prop({ default: false })
  status: boolean;
}

export const GoogleCountriesSchema =
  SchemaFactory.createForClass(GoogleCountries);
