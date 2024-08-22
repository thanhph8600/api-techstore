import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CardLinkDocument = HydratedDocument<CardLink>;

@Schema()
export class CardLink {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Wallet' })
  walletId: Types.ObjectId;

  @Prop({ required: true })
  cardNumber: string;

  @Prop({ required: true })
  cardHolderName: string;

  @Prop({ required: true })
  cvv: number;

  @Prop({ required: true })
  expiryDate: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CardLinkSchema = SchemaFactory.createForClass(CardLink);
