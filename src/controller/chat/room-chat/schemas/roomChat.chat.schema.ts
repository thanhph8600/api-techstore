import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type RoomChatDocument = HydratedDocument<RoomChat>;

@Schema()
export class RoomChat {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer' })
  id_customer: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Messenger' })
  id_lastMess: ObjectId;
}

export const RoomChatSchema = SchemaFactory.createForClass(RoomChat);

RoomChatSchema.virtual('messenger', {
  ref: 'Messenger',
  localField: '_id',
  foreignField: 'id_roomChat',
  justOne: false,
});
