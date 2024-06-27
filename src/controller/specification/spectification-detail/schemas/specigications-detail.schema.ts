import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export type SpecificationsDetailDocument =
  HydratedDocument<SpecificationsDetail>;

@Schema()
export class SpecificationsDetail {
  _id: string;

  @Prop()
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Specification' })
  id_specification: string;
}

export const SpecificationsDetailSchema =
  SchemaFactory.createForClass(SpecificationsDetail);
