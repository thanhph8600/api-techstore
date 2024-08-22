/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartSelectDocument = HydratedDocument<CartSelect>;

@Schema()
export class CartSelect {
  @Prop({ type: Types.ObjectId, required: true })
  customerId: Types.ObjectId;

  @Prop([{ type: { productPriceId: { type: Types.ObjectId, ref: 'ProductPrice' } }, _id: false }])
  listProductSelect: { productPriceId: Types.ObjectId }[];
}

export const CartSelectSchema = SchemaFactory.createForClass(CartSelect);
