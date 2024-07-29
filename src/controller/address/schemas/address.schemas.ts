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

  @Prop({ default: false })
  addressType: boolean;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({})
  province: string;

  @Prop({})
  district: string;

  @Prop({})
  ward: string;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
