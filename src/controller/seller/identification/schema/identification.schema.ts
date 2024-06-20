import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, ObjectId } from 'mongoose';

export type IdentificationDocument = HydratedDocument<Identification>;

@Schema()
export class Identification {
  _id: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Shop' }] })
  id_shop: ObjectId;

  @Prop()
  full_name: string;

  @Prop()
  CCCD_number: string;

  @Prop()
  CCCD_photo: string;
}

export const IdentificationSchema =
  SchemaFactory.createForClass(Identification);
