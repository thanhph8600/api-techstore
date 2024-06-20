import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  _id: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Shop' }] })
  id_shop: ObjectId;

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

export const ProductSchema = SchemaFactory.createForClass(Product);
