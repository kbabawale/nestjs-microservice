import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import * as mongoose from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'category',
  toJSON: { getters: true },
})
export class Category extends AbstractDocument {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ required: true, default: '' })
  image: string;
}

const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({
  name: 'text',
});
export { CategorySchema };
