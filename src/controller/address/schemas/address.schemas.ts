import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Address extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  customerId: string;

  @Prop({})
  fullName: string;

  @Prop({})
  phoneNumber: string;

  @Prop({})
  address: string;

  @Prop({ default: 'Nhà riêng' })
  addressType: string;

  @Prop({ default: false })
  isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
