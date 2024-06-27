import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type DetailCategoryDocument = HydratedDocument<DetailCategory>;

@Schema()
export class DetailCategory {
  _id: string;
  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }],
  })
  id_category: ObjectId;

  @Prop()
  name: string;

  @Prop()
  thumbnail: string;

  @Prop()
  id_specification: string[];

  @Prop()
  slug: string;
}

export const DetailCategorySchema =
  SchemaFactory.createForClass(DetailCategory);
