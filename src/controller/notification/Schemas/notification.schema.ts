import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<Notification>;

export enum NotificationType {
  ORDER = 'order',
  WALLET = 'wallet',
  EVENT = 'event',
}

@Schema()
export class Notification {
  _id: string;

  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customerId: Types.ObjectId;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({
    type: Types.ObjectId,
    ref: 'ItemsOrder',
    required: function () {
      return this.type === NotificationType.ORDER;
    },
  })
  orderItemsId?: Types.ObjectId;

  @Prop({ default: false })
  read: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
