import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WalletDocument = HydratedDocument<Wallet>;

@Schema()
export class Wallet {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ type: Date, default: new Date() })
  created_At: Date;
}
export const WalletSchema = SchemaFactory.createForClass(Wallet);
