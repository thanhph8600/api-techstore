import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema()
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({
    type: [
      {
        shopId: { type: Types.ObjectId, ref: 'Shop', required: true },
        items: [
          {
            productPriceId: { type: Types.ObjectId, ref: 'ProductPrice', required: true },
            quantity: { type: Number, required: true },
            discountDetailId: { type: Types.ObjectId , ref:'DiscountDetail' },
          }
        ],
        _id: false
      }
    ]
  })
  cartItems: {
    shopId: Types.ObjectId;
    items: {
      productPriceId: Types.ObjectId;
      quantity: number;
      discountDetailId: Types.ObjectId;
    }[];
  }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
