import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';

export type SpecificationDocument = HydratedDocument<Specification>;

@Schema()
export class Specification {
  _id: ObjectId;
  @Prop()
  name: string;
}

export const SpecificationSchema = SchemaFactory.createForClass(Specification);
