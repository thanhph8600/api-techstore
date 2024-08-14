import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type MessengerDocument = HydratedDocument<Messenger>;

@Schema()
export class Messenger {
  _id: string;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'RoomChat' })
  id_roomChat: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'senderType' })
  id_sender: ObjectId;

  @Prop({ type: String, enum: ['Customer', 'Shop'], required: true })
  senderType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
  id_product: ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order' })
  id_order: ObjectId;

  @Prop()
  thumbnail: string;

  @Prop()
  video: string;

  @Prop()
  content: string;

  @Prop({ default: false })
  isWatched: boolean;

  @Prop({ default: Date.now })
  created_at: Date;
}

export const MessengerSchema = SchemaFactory.createForClass(Messenger);
