import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReturnOrderDocument = HydratedDocument<ReturnOrder>;

@Schema()
export class ReturnOrder {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
    customerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'ItemsOrder' })
    itemOrder: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Shop' })
    shopId: Types.ObjectId;

    @Prop({
        type: [
            {
                productPriceId: {
                    type: Types.ObjectId,
                    ref: 'ProductPrice',
                    required: true,
                },
                quantity: { type: Number, required: true },
                discountDetailId: { type: Types.ObjectId, ref: 'DiscountDetail' },
                returnReason: { type: String, required: true },
                refundAmount: { type: Number, required: true },
                description: { type: String },
                image: { type: [String], default: [] },
            },
        ],
        _id: false,
    })
    itemsReturn: {
        productPriceId: Types.ObjectId;
        quantity: number;
        discountDetailId?: Types.ObjectId;
        returnReason: string;
        refundAmount: number;
        description?: string;
        image?: string[];
    }[];
    @Prop({
        type: String,
        enum: ['Đang chờ', 'Đã xử lý', 'Từ chối', 'Hoàn tiền'],
        default: 'Đang chờ',
    })
    status: string;

    @Prop({ type: Date, default: Date.now })
    returnDate: Date;
}

export const ReturnOrderSchema = SchemaFactory.createForClass(ReturnOrder);
