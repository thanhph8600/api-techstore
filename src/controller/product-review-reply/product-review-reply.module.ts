import { Module } from '@nestjs/common';
import { ProductReviewReplyService } from './product-review-reply.service';
import { ProductReviewReplyController } from './product-review-reply.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductReviewReply,
  ProductReviewReplySchema,
} from './schemas/product-review-reply.schema';
import { ShopModule } from '../seller/shop/shop.module';
import { ProductReviewModule } from '../product-review/product-review.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductReviewReply.name, schema: ProductReviewReplySchema },
    ]),
    ShopModule,
    ProductReviewModule,
  ],
  controllers: [ProductReviewReplyController],
  providers: [ProductReviewReplyService],
  exports: [ProductReviewReplyService, ProductReviewReplyModule],
})
export class ProductReviewReplyModule {}
