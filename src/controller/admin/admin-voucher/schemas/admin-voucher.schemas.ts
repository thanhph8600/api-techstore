import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, ObjectId, Types, } from 'mongoose';

@Schema()
export class AdminVoucher extends Document {
    _id: string;
  
    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Customer' }] })
    id_customer: Types.ObjectId[];
  
    @Prop()
    type: string;
  
    @Prop()
    name: string;
  
    @Prop()
    code: string;
  
    @Prop()
    time_start: Date;
  
    @Prop()
    time_end: Date;
  
    @Prop()
    percent: number;
  
    @Prop()
    maximum_reduction: number;
  
    @Prop()
    minimum_order_value: number;
  
    @Prop()
    maximum_total_usage: number;

    @Prop({default: false})
    is_public: boolean;
  
    @Prop({ default: Date.now })
    time_created: Date;
}

export const AdminVoucherSchemas = SchemaFactory.createForClass(AdminVoucher);
