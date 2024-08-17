import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ItemsOrderDocument = HydratedDocument<ItemsOrder>;

@Schema()
export class ItemsOrder {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Order' })
  orderId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Shop' })
  shopId: Types.ObjectId;

  @Prop({
    type: [
      {
        productPriceId: { type: Types.ObjectId, ref: 'ProductPrice', required: true },
        quantity: { type: Number, required: true },
        discountDetailId: { type: Types.ObjectId, ref: 'DiscountDetail' },
      },
    ],
    _id: false,
  })
  items: {
    productPriceId: Types.ObjectId;
    quantity: number;
    discountDetailId?: Types.ObjectId;
  }[];

  @Prop({ type: [{ key: String, value: Date }]})
  statusUpdate: {
    key: string;
    value: Date;
  }[];

  @Prop({ type: Number, required: true })
  costShipping: number;

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: Number, required: true })
  subTotal: number;

  @Prop({ type: Number, required: true })
  discount: number;

  @Prop({ type: Number, required: true})
  coin: number;

  @Prop({ type: Types.ObjectId, required: false, default: null , ref: 'Voucher'})
  voucherShopId: Types.ObjectId;

  @Prop({ type: String, required: false, default: null , enum: ['Đã gửi hàng' , 'Đã giao hàng' ]})
  statusShipping: string;

  @Prop({ type: String , required: false , default: 'Chờ xác nhận' , enum: ['Chờ xác nhận', 'Xác nhận', 'Đang vận chuyển' , 'Hoàn thành' , 'Huỷ đơn hàng' , 'Hoàn hàng' ] })
  status: string;

  @Prop({ type: Boolean , required: false , default: false })
  rateDate: boolean;

  @Prop({ type: Date , required: false , default: null })
  DeliveryTime: Date;

  @Prop({ type: Date, default: Date.now })
  created: Date;

  @Prop({ type: Date, default: Date.now })
  updated: Date;
}

export const ItemsOrderSchema = SchemaFactory.createForClass(ItemsOrder);
