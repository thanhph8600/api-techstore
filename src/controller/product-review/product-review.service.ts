import { Injectable } from '@nestjs/common';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReview } from './schemas/product-review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemsOrderService } from '../items-order/items-order.service';
import { CustomerRewardService } from '../customer-reward/customer-reward.service';
@Injectable()
export class ProductReviewService {
  constructor(
    @InjectModel(ProductReview.name)
    private readonly productReviewModel: Model<ProductReview>,
    private readonly itemsOrderService: ItemsOrderService,
    private readonly customerRewartService: CustomerRewardService,
  ) {}
  async create(createProductReviewDto: CreateProductReviewDto) {
    await this.customerRewartService.addCoinRewardReviewProduct(
      createProductReviewDto?.customerId,
    );
    return this.productReviewModel.create(createProductReviewDto);
  }

  findAll() {
    return `This action returns all productReview`;
  }
  async getRatingByProductId(id: string) {
    const productReviews = await this.productReviewModel.find({
      productId: id.toString(),
    });

    if (productReviews.length > 0) {
      const rating =
        productReviews.reduce((a, b) => a + b.rating, 0) /
        productReviews.length;
      return rating;
    } else {
      return 0;
    }
  }

  async getReviewByIdProduct(id: string) {
    const productReviews = await this.productReviewModel
      .find({ productId: id.toString() })
      .populate({
        path: 'customerId',
        select: 'name phone avata',
      })
      .populate({
        path: 'productPriceId',
        select: 'id_color id_product id_size price stock',
        populate: [
          {
            path: 'id_color',
            select: 'value',
          },
          {
            path: 'id_product',
            select: 'name , thumbnails',
          },
          {
            path: 'id_size',
            select: 'value',
          },
        ],
      });
    return productReviews;
  }
  findOne(id: number) {
    return `This action returns a #${id} productReview`;
  }

  update(id: number, updateProductReviewDto: UpdateProductReviewDto) {
    console.log(updateProductReviewDto);
    return `This action updates a #${id} productReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} productReview`;
  }
}
