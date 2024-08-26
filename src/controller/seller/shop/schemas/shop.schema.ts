import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Schema as MongooseSchema,
  ObjectId,
  Types,
} from 'mongoose';

export type ShopDocument = HydratedDocument<Shop>;

@Schema()
export class Shop {
  _id: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Customer' }] })
  id_customer: ObjectId;

  @Prop()
  name: string;

  @Prop()
  thumbnail: string;

  @Prop()
  description: string;

  @Prop()
  address: string;

  @Prop({ default: 0 })
  count_follower: number;

  @Prop({ default: 0 })
  star: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Customer' }] })
  follows?: Types.ObjectId[];
}

export const shopSchema = SchemaFactory.createForClass(Shop);

shopSchema.virtual('AddressShop', {
  ref: 'AddressShop',
  localField: '_id',
  foreignField: 'id_shop',
  justOne: false,
});

shopSchema.virtual('ShopView', {
  ref: 'ShopView',
  localField: '_id',
  foreignField: 'id_shop',
  justOne: false,
});

// Thiết lập để virtual field xuất hiện khi gọi populate
shopSchema.set('toObject', { virtuals: true });
shopSchema.set('toJSON', { virtuals: true });
