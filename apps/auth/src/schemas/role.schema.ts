import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import { RolesPermission } from '../model/user.model';
import * as mongoose from 'mongoose';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'role',
  toJSON: { getters: true },
})
export class Role extends AbstractDocument {
  @Prop({ default: '', unique: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  privileges: RolesPermission[];
}

export const RoleSchema = SchemaFactory.createForClass(Role);
