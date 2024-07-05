import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../libs/common/src';

@Schema({ versionKey: false, timestamps: true, collection: 'bank' })
export class Bank extends AbstractDocument {
  @Prop({ unique: true })
  name: string;

  @Prop({ unique: true })
  code: string;
}

export const BankSchema = SchemaFactory.createForClass(Bank);
