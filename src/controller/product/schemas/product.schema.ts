import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
  _id: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Shop' }] })
  id_shop: Types.ObjectId;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'CategoryDetail' }],
  })
  id_categoryDetail: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  thumbnails: string[];

  @Prop()
  description: string;

  @Prop({ default: 0 })
  view: number;

  @Prop({ default: false })
  banned: boolean;

  @Prop({ default: false })
  unlisted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.virtual('product_specifications', {
  ref: 'ProductSpecification',
  localField: '_id',
  foreignField: 'id_product',
  justOne: false,
});

ProductSchema.virtual('variation_color', {
  ref: 'VariationColor',
  localField: '_id',
  foreignField: 'id_product',
  justOne: false,
});

ProductSchema.virtual('variation_size', {
  ref: 'VariationSize',
  localField: '_id',
  foreignField: 'id_product',
  justOne: false,
});

ProductSchema.virtual('product_price', {
  ref: 'ProductPrice',
  localField: '_id',
  foreignField: 'id_product',
  justOne: false,
});
