import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type ProductPriceDocument = HydratedDocument<ProductPrice>;

@Schema()
export class ProductPrice {
  _id: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  id_product: ObjectId;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'VariationSize' }],
  })
  id_size: ObjectId;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'VariationColor' }],
  })
  id_color: ObjectId;

  @Prop()
  price: number;

  @Prop({ default: 0 })
  stock: number;
}

export const ProductPriceSchema = SchemaFactory.createForClass(ProductPrice);
ProductPriceSchema.virtual('discount_detail', {
  ref: 'DiscountDetail',
  localField: '_id',
  foreignField: 'id_productPrice',
  justOne: false,
});
