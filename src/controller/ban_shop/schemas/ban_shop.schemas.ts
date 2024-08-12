import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';

@Schema()
export class BanShop extends Document {
    
    _id: string

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop'})
    id_shop: string;

    @Prop({ default: ""})
    banStartDate: Date

    @Prop({default: ""})
    banEndDate: Date

    @Prop({default: 0})
    numberOfBan: number

    @Prop({})
    reasonBan: string


}

export const BanShopSchema = SchemaFactory.createForClass(BanShop)