import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubOrderDocument = HydratedDocument<SubOrder>;

@Schema()
export class SubOrder {
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ type: String, default: null})
  address: string;

  @Prop({ type: String, default: null })
  shipping: string;

  @Prop({ type: Types.ObjectId, default: null })
  voucherShop: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: null, ref: 'Voucher' })
  voucher2t: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  coin: number;

  @Prop({ type: Number, default: 0 })
  costShipping: number;

  @Prop({ type: Number, default: 0 })
  totalDisCount: number;

  @Prop({ type: Number, default: 0 })
  coinRefunt: number;

  @Prop({ type: Types.ObjectId, default: null })
  voucherShipping: Types.ObjectId;

  @Prop({ type: String, default: null })
  methodPayment: string;

  @Prop({ 
    type: [{ 
      productPriceId: { type: Types.ObjectId, ref: 'ProductPrice' }, 
      quantity: { type: Number, default: 1 } 
    }], 
    _id: false, 
    default: [] 
  })
  items: { productPriceId: Types.ObjectId; quantity: number }[];

  @Prop({ type: Number, default: 0 })
  subTotal: number;

  @Prop({ type: Number, default: 0 })
  total: number;

  customerReward?: any
}

export const SubOrderSchema = SchemaFactory.createForClass(SubOrder);
