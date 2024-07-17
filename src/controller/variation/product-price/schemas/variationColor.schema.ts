import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type VariationColorDocument = HydratedDocument<VariationColor>;

@Schema()
export class VariationColor {
  _id: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  id_product: ObjectId;

  @Prop()
  value: string;
}

export const VariationColorSchema =
  SchemaFactory.createForClass(VariationColor);
