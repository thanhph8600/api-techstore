import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type FlashSaleDocument = HydratedDocument<FlashSale>;

@Schema()
export class FlashSale {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: ObjectId;

  @Prop()
  time_start: Date;

  @Prop()
  time_end: Date;

  @Prop({ default: true })
  status: boolean;

  @Prop({ default: 0 })
  view: number;

  @Prop({ default: 0 })
  number_reminders: number;

  @Prop({ default: new Date() })
  created: Date;
}

export const FlashSaleSchema = SchemaFactory.createForClass(FlashSale);
FlashSaleSchema.virtual('flashSale_detail', {
  ref: 'FlashSaleDetail',
  localField: '_id',
  foreignField: 'id_flashSale',
  justOne: false,
});
