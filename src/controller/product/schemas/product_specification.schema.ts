import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Schema as MongooseSchema,
  ObjectId,
  Types,
} from 'mongoose';

export type ProductSpecificationDocument =
  HydratedDocument<ProductSpecification>;

@Schema()
export class ProductSpecification {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  id_product: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Specification' })
  id_specifications: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'SpecificationsDetail' })
  id_specifications_detail: ObjectId;
}

export const ProductSpecificationSchema =
  SchemaFactory.createForClass(ProductSpecification);
