import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type SpecificationsDetailDocument =
  HydratedDocument<SpecificationsDetail>;

@Schema()
export class SpecificationsDetail {
  _id: string;

  @Prop()
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Specification' })
  id_specification: ObjectId[];
}

export const SpecificationsDetailSchema =
  SchemaFactory.createForClass(SpecificationsDetail);
