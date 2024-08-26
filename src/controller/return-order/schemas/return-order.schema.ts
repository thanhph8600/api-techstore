import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ReturnOrderDocument = HydratedDocument<ReturnOrder>;

@Schema()
export class ReturnOrder {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Customer' })
    customerId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'ItemsOrder' })
    itemsOrderId: Types.ObjectId;

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
                images: { type: [String], default: [] },
                discount2t: { type: Number },
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
        discount2t?: number
    }[];
    @Prop({
        type: String,
        enum: ['Đã tiếp nhận', 'Đã gửi hàng lại', 'Kiểm tra hàng hoàn', 'Hoàn tiền', 'Từ chối'],
        default: 'Đã tiếp nhận',
    })
    status: string;

    @Prop({ default: [] })
    statusUpdate: { key: string; value: Date }[];

    @Prop({ type: Date, default: Date.now })
    returnDate: Date;
}

export const ReturnOrderSchema = SchemaFactory.createForClass(ReturnOrder);
