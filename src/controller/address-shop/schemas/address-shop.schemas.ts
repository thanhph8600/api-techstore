import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type AddressShopDocument = HydratedDocument<AddressShop>;

@Schema()
export class AddressShop {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Shop' })
  id_shop: Types.ObjectId;

  @Prop({})
  province: string;

  @Prop({})
  district: string;

  @Prop({})
  ward: string;

  @Prop({})
  address: string;
}

export const AddressShopSchema = SchemaFactory.createForClass(AddressShop);
