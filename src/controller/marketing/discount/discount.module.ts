import { forwardRef, Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discount, DiscountSchema } from './schemas/discount.schema';
import {
  DiscountDetail,
  DiscountDetailSchema,
} from './schemas/discount-detail';
import { ShopModule } from 'src/controller/seller/shop/shop.module';
import { CartModule } from 'src/controller/cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Discount.name,
        schema: DiscountSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: DiscountDetail.name,
        schema: DiscountDetailSchema,
      },
    ]),
    forwardRef(() => ShopModule),
    forwardRef(() => CartModule),
  ],
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService ],
})
export class DiscountModule {}
