/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({ type: Types.ObjectId, required: true })
  customerId: Types.ObjectId;

  @Prop([{ type: { productId: { type: Types.ObjectId }, quantity: { type: Number } }, _id: false }])
  cartItems: { productId: Types.ObjectId; quantity: number }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
