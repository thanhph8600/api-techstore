import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ItemsSubOrderDocument = HydratedDocument<ItemsSubOrder>;

@Schema()
export class ItemsSubOrder {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'SubOrder' })
  subOrderId: Types.ObjectId;

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

  @Prop({ type: Number, required: true, default: 8000 })
  costShipping: number;

  @Prop({ type: Number, required: true, default: 0 })
  total: number;

  @Prop({ type: Number, required: true, default: 0 })
  discount: number;

  @Prop({ type: Number, required: true, default: 0 })
  coin: number;

  @Prop({ type: Types.ObjectId, required: false, default: null , ref: 'Voucher'})
  voucherShopId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false, default: null })
  voucher2t?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: false, default: null })
  voucherShipping?: Types.ObjectId;
}

export const ItemsSubOrderSchema = SchemaFactory.createForClass(ItemsSubOrder);
