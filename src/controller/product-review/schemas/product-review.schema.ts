import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProductReviewDocument = HydratedDocument<ProductReview>;

@Schema()
export class ProductReview {
  _id: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  productId: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'ProductPrice' })
   productPriceId: Types.ObjectId;

   @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
   customerId: Types.ObjectId;

  @Prop({ required: false })
  content: string;

   @Prop({ type: [String] , required: false })
   images: [string];

  @Prop({ required: true })
  rating: number;

  @Prop({ type: Date, default: Date.now })
  created: Date;
}

export const ProductReviewSchema = SchemaFactory.createForClass(ProductReview);
