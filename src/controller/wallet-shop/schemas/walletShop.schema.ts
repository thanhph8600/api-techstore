import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WalletShopDocument = HydratedDocument<WalletShop>;

@Schema()
export class WalletShop {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Shop' })
  id_shop: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ type: Date, default: new Date() })
  created_At: Date;
}
export const WalletShopSchema = SchemaFactory.createForClass(WalletShop);
