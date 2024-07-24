import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  _id: string;

  @Prop({ type: Types.ObjectId, required: true })
  customerId: Types.ObjectId;

  @Prop({ type: String, default: 'waiting' })
  status: string;

  @Prop({ type: String, default: '' })
  address: string;

  @Prop({ type: String, default: '' })
  shipping: string;

  @Prop({ type: Types.ObjectId, default: null })
  voucherShop: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: null })
  voucher2t: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  coin: number;

  @Prop({ type: Number, default: 0 })
  costShipping: number;

  @Prop({ type: Types.ObjectId, default: null })
  voucherShipping: Types.ObjectId;

  @Prop({ type: String, default: '' })
  methodPayment: string;

  @Prop({ 
    type: [{ 
      productPriceId: { type: Types.ObjectId, ref: 'ProductPrice' }, 
      quantity: { type: Number, default: 1 } 
    }], 
    _id: false, 
    default: [] 
  })
  Items: { productPriceId: Types.ObjectId; quantity: number }[];

  @Prop({ type: Number, default: 0 })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
