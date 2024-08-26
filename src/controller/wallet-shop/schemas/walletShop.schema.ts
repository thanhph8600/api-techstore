import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WalletShopDocument = HydratedDocument<WalletShop>;

@Schema()
export class WalletShop {
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Shop' })
  id_shop: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ type: Date, default: new Date() })
  created_At: Date;
}
export const WalletShopSchema = SchemaFactory.createForClass(WalletShop);

WalletShopSchema.virtual('wallet_transaction', {
  ref: 'WalletShopTransactions',
  localField: '_id',
  foreignField: 'walletId',
  justOne: false,
});
// Thiết lập để virtual field xuất hiện khi gọi populate
WalletShopSchema.set('toObject', { virtuals: true });
WalletShopSchema.set('toJSON', { virtuals: true });
