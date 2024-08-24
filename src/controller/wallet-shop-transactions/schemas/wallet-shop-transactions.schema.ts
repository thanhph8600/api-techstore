import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type WalletShopTransactionsDocument =
  HydratedDocument<WalletShopTransactions>;

@Schema()
export class WalletShopTransactions {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'WalletShop' })
  walletId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, enum: ['deposit', 'withdraw'], required: true })
  type: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Date, default: Date.now() })
  created_At: Date;
}

export const WalletShopTransactionsSchema = SchemaFactory.createForClass(
  WalletShopTransactions,
);
