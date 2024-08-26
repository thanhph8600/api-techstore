import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type ProductViewDocument = HydratedDocument<ProductView>;

@Schema()
export class ProductView {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  id_product: Types.ObjectId;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const ProductViewSchema = SchemaFactory.createForClass(ProductView);
