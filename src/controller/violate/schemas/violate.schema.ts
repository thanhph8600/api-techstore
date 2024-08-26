import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ViolateFollowDocument = HydratedDocument<ViolateFollow>;

@Schema()
export class ViolateFollow {
  @Prop({ type: Types.ObjectId, required: true })
  customerId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  shopId?: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  count: number;
}

export const ViolateFollowSchema = SchemaFactory.createForClass(ViolateFollow);
