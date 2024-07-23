import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema()
export class Voucher {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: ObjectId;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  id_product: ObjectId[];

  @Prop()
  type: string;

  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  time_start: Date;

  @Prop()
  time_end: Date;

  @Prop()
  percent: number;

  @Prop()
  maximum_reduction: number;

  @Prop()
  minimum_order_value: number;

  @Prop()
  maximum_total_usage: number;

  @Prop()
  number_of_uses: number;

  @Prop({ default: Date.now })
  created: Date;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
