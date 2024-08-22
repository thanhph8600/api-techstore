import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WalletTransactionsDocument = HydratedDocument<WalletTransactions>;

@Schema()
export class WalletTransactions {
  @Prop({ type: Types.ObjectId, required: true , ref: 'Wallet' })
  walletId: Types.ObjectId;
  
  @Prop({ type: Number , required: true })
  amount: number;

  @Prop({ type: String , enum: ['deposit', 'withdraw'] , required: true })
  type: string;

  @Prop({type: String , required: true})
  description: string;

  @Prop({ type: Types.ObjectId, required: false , ref: 'CardLink' })
  cardId: Types.ObjectId;

  @Prop({type: Date , default: Date.now()})
  created_At: Date;
}

export const WalletTransactionsSchema = SchemaFactory.createForClass(WalletTransactions);
