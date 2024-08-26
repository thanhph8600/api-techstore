import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ShopViewDocument = HydratedDocument<ShopView>;

@Schema()
export class ShopView {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const ShopViewSchema = SchemaFactory.createForClass(ShopView);
