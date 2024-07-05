import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'permission',
  toJSON: { getters: true },
})
export class Permission extends AbstractDocument {
  @Prop({ default: '', unique: true })
  name: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
