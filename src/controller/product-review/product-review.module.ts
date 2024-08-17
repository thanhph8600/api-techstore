import { Module } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { ProductReviewController } from './product-review.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductReview,
  ProductReviewSchema,
} from './schemas/product-review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ProductReview.name,
        schema: ProductReviewSchema,
      },
    ]),
  ],
  controllers: [ProductReviewController],
  providers: [ProductReviewService],
  exports: [ProductReviewService],
})
export class ProductReviewModule {}
