import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type DiscountDocument = HydratedDocument<Discount>;

@Schema()
export class Discount {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: ObjectId;

  @Prop()
  name: string;

  @Prop()
  type: string;

  @Prop()
  time_start: Date;

  @Prop()
  time_end: Date;

  @Prop({ default: Date.now })
  created: Date;
}

export const DiscountSchema = SchemaFactory.createForClass(Discount);
DiscountSchema.virtual('discount_detail', {
  ref: 'DiscountDetail',
  localField: '_id',
  foreignField: 'id_discocunt',
  justOne: false,
});
