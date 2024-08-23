import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  _id: string;

  @Prop({ type: Types.ObjectId, required: true })
  customerId: Types.ObjectId;

  @Prop({ type: String, default: 'processing' })
  status: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Address' })
  address: string;

  @Prop({ type: String, default: '' })
  shipping: string;

  @Prop({ type: Types.ObjectId, default: null })
  voucherShop: Types.ObjectId;

  @Prop({ type: Types.ObjectId, default: null })
  voucher2t: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  totalDiscount: number;

  @Prop({ type: Number, default: 0 })
  coin: number;

  @Prop({ type: Number, default: 0 })
  coinRefunt: number;

  @Prop({ type: Number, default: 0 })
  costShipping: number;

  @Prop({ type: Types.ObjectId, default: null })
  voucherShipping: Types.ObjectId;

  @Prop({ type: String, default: '' })
  methodPayment: string;

  @Prop({ type: Number, default: 0 })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
