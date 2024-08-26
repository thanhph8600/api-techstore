import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type MessageShortCutDocument = HydratedDocument<MessageShortCut>;

@Schema()
export class MessageShortCut {
  _id: ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: ObjectId;

  @Prop()
  contents: string[];

  @Prop()
  group_name: string;

  @Prop({ default: true })
  status: boolean;
}

export const MessageShortCutSchema =
  SchemaFactory.createForClass(MessageShortCut);
