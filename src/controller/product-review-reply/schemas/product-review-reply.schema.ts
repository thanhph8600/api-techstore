import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type ProductReviewReplyDocument = HydratedDocument<ProductReviewReply>;

@Schema()
export class ProductReviewReply {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductReview' })
  id_productReview: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: Types.ObjectId;

  @Prop({ required: false })
  content: string;

  @Prop({ type: [String], required: false })
  images: [string];

  @Prop({ type: Date, default: Date.now })
  created: Date;
}

export const ProductReviewReplySchema =
  SchemaFactory.createForClass(ProductReviewReply);
