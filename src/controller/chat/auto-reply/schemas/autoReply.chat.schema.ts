import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId, Schema as MongooseSchema } from 'mongoose';

export type AutoReplyDocument = HydratedDocument<AutoReply>;

@Schema()
export class AutoReply {
  _id: ObjectId;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: ObjectId;

  @Prop()
  content: string;

  @Prop()
  status: boolean;
}

export const AutoReplySchema = SchemaFactory.createForClass(AutoReply);
