import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type HistorySearchDocument = HydratedDocument<HistorySearch>;

@Schema()
export class HistorySearch {
  @Prop({ type: Types.ObjectId, required: true })
  customerId: Types.ObjectId;

  @Prop([String]) 
  query: string[];
}

export const HistorySearchSchema = SchemaFactory.createForClass(HistorySearch);
