import { Module } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { ProductReviewController } from './product-review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductReview, ProductReviewSchema } from './schemas/product-review.schema';
import { ItemsOrderModule } from '../items-order/items-order.module';
import { CustomerRewardModule } from '../customer-reward/customer-reward.module';
import { ShopModule } from '../seller/shop/shop.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductReview.name,
        schema: ProductReviewSchema,
      },
    ]),
    ItemsOrderModule,
    CustomerRewardModule,
    ShopModule,
  ],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
  exports: [ProductReviewService],
})
export class ProductReviewModule {}
