import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductReviewDocument = HydratedDocument<ProductReview>;

@Schema()
export class ProductReview {
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  productId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  customerId: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ type: String })
  image: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ type: Date, default: Date.now })
  created: Date;
}

export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview);
