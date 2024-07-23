import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Schema as MongooseSchema } from 'mongoose';

export type DiscountDetailDocument = HydratedDocument<DiscountDetail>;

const isValidLimit = (value: number | string) => {
  // Allow number or specific string
  return typeof value === 'number' || value === 'Không giới hạn';
};

@Schema()
export class DiscountDetail {
  _id: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Discount' })
  id_discocunt: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'ProductPrice' })
  id_productPrice: Types.ObjectId;

  @Prop()
  percent: number;

  @Prop({
    type: MongooseSchema.Types.Mixed,
    validate: {
      validator: isValidLimit,
      message: (props) => `${props.value} is not a valid limit_product value!`,
    },
  })
  limit_product: number | 'Không giới hạn';

  @Prop({
    type: MongooseSchema.Types.Mixed,
    validate: {
      validator: isValidLimit,
      message: (props) => `${props.value} is not a valid limit_product value!`,
    },
  })
  limit_customer: number | 'Không giới hạn';

  @Prop()
  status: boolean;
}

export const DiscountDetailSchema =
  SchemaFactory.createForClass(DiscountDetail);
