import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

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
  count_follower: string;

  @Prop({ default: 0 })
  star: string;
}

export const shopSchema = SchemaFactory.createForClass(Shop);
