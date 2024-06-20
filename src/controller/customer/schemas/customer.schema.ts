import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
  _id: string;
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop({ default: 'avata-default.jpg' })
  avata: string;

  @Prop({ default: 1 })
  role: number;

  @Prop({ default: '' })
  refresh_token: string;

  @Prop({ default: false })
  isBan: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
