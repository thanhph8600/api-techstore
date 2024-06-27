import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BrandDocument = HydratedDocument<Brand>;

@Schema()
export class Brand {
  _id: string;
  @Prop()
  name: string;

  @Prop()
  thumbnail: string;

  @Prop()
  slug: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);
