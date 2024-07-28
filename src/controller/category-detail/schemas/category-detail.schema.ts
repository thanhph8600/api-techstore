import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types, HydratedDocument } from 'mongoose';

export type CategoryDetailDocument = HydratedDocument<CategoryDetail>;

@Schema()
export class CategoryDetail {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category' })
  id_category: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  thumbnail: string;

  @Prop()
  id_specification: string[];

  @Prop()
  slug: string;
}

export const CategoryDetailSchema =
  SchemaFactory.createForClass(CategoryDetail);
