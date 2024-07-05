import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'brand',
  toJSON: { getters: true },
})
export class Brand extends AbstractDocument {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  logo: string;

  @Prop({ required: true, default: '' })
  country: string;
}

const BrandSchema = SchemaFactory.createForClass(Brand);
BrandSchema.index({
  name: 'text',
});
export { BrandSchema };
