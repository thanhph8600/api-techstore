import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerFollowDocument = HydratedDocument<CustomerFollow>;

@Schema()
export class CustomerFollow {
  @Prop({ type: Types.ObjectId, required: true })
  customerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  shopId: Types.ObjectId;
}

export const CustomerFollowSchema =
  SchemaFactory.createForClass(CustomerFollow);
