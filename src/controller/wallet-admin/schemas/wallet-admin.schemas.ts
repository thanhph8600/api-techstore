import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId, Types } from 'mongoose';

@Schema()
export class WalletAdmin extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  id_customer: Types.ObjectId;

  @Prop({type: Number,default: 0})
  balance: number;

  @Prop({type: Date,default: new Date()})
  created_at: Date
}

export const WalletAdminSchemas = SchemaFactory.createForClass(WalletAdmin);
