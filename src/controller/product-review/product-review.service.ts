import { Injectable } from '@nestjs/common';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReview } from './schemas/product-review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
@Injectable()
export class ProductReviewService {
  constructor(
    @InjectModel(ProductReview.name)
    private readonly productReviewModel: Model<ProductReview>,
  ) {}
  create(createProductReviewDto: CreateProductReviewDto) {
    return this.productReviewModel.create(createProductReviewDto);
  }

  findAll() {
    return `This action returns all productReview`;
  }
  async getRatingByProductId(id: string) {
    const productId = new Types.ObjectId(id);
    const productReviews = await this.productReviewModel.find({
      productId: productId,
    });
    // if(productReviews.length > 0) {
    //   const rating = productReviews.reduce((a, b) => a + b.rating, 0) / productReviews.length;
    //   return rating;
    // } else {
    //   return 0;
    // }
    return 4.5;
  }
  findOne(id: number) {
    return `This action returns a #${id} productReview`;
  }

  update(id: number, updateProductReviewDto: UpdateProductReviewDto) {
    return `This action updates a #${id} productReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} productReview`;
  }
}
