import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type VariationSizeDocument = HydratedDocument<VariationSize>;

@Schema()
export class VariationSize {
  _id: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Product' }] })
  id_product: ObjectId;

  @Prop()
  value: string;
}

export const VariationSizeSchema = SchemaFactory.createForClass(VariationSize);
