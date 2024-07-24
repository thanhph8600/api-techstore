import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerRewardDocument = HydratedDocument<CustomerReward>;

@Schema()
export class CustomerReward {
  @Prop({ type: Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;
  
  @Prop({type: Number, default: 0})
  coin: number;

  @Prop([{type: Types.ObjectId, ref: 'Voucher'}])
  voucher: Types.ObjectId[];
}

export const CustomerRewardSchema = SchemaFactory.createForClass(CustomerReward);
