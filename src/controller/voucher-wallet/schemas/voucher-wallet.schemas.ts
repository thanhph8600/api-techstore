import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId, Types } from 'mongoose';

@Schema()
export class VoucherWallet extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  id_customer: Types.ObjectId;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'AdminVoucher' }],
  })
  wallet_warehouse: Types.ObjectId[];
}

export const VoucherWalletSchemas = SchemaFactory.createForClass(VoucherWallet);
