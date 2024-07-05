import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';
import * as mongoose from 'mongoose';
import {
  DistributorField,
  ManufacturerField,
  PriceField,
} from '../model/inventory.model';

@Schema({
  versionKey: false,
  timestamps: true,
  collection: 'inventory',
  toJSON: { getters: true },
})
export class Inventory extends AbstractDocument {
  @Prop({ required: true, default: '' })
  name: string;

  @Prop({ enum: ['Active', 'Blocked'], default: 'Active' })
  status: string;

  @Prop({ required: true, default: false })
  published: boolean;

  @Prop({ required: true, default: '' })
  category: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: [] })
  images?: string[];

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed, default: {} })
  price: PriceField;

  @Prop({ default: 0 })
  stockCount: number;

  @Prop({ required: false, default: '' })
  sku?: string;

  @Prop({ required: false, type: mongoose.Schema.Types.Mixed, default: {} })
  manufacturer?: ManufacturerField;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed, default: {} })
  distributor?: DistributorField;

  @Prop({ required: false, default: '' })
  tag?: string;

  /**
   * weight in KG
   */
  @Prop({ required: false, default: 0.1 })
  weight?: number; //in KG

  @Prop({ default: '' })
  nafdacRegistration?: string;

  @Prop({ required: true, default: '' })
  description?: string;
}

const InventorySchema = SchemaFactory.createForClass(Inventory);
InventorySchema.index({
  name: 'text',
  category: 'text',
  'manufacturer.name': 'text',
  description: 'text',
  tag: 'text',
});
export { InventorySchema };
