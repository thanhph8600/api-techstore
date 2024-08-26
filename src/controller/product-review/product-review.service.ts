import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReview } from './schemas/product-review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItemsOrderService } from '../items-order/items-order.service';
import { CustomerRewardService } from '../customer-reward/customer-reward.service';
@Injectable()
export class ProductReviewService {
  constructor(
    @InjectModel(ProductReview.name) private readonly productReviewModel: Model<ProductReview>,
    private readonly itemsOrderService: ItemsOrderService,
    private readonly customerRewartService: CustomerRewardService
  ) {}
  async create(createProductReviewDto: CreateProductReviewDto) {
   await this.customerRewartService.addCoinRewardReviewProduct(createProductReviewDto?.customerId);
    return this.productReviewModel.create(createProductReviewDto);
  }

  findAll() {
    return `This action returns all productReview`;
  }
  async getRatingByProductId(id: string) {
    const productReviews = await this.productReviewModel.find({productId: id.toString()});
    
    if(productReviews.length > 0) {
      const rating = productReviews.reduce((a, b) => a + b.rating, 0) / productReviews.length;
      return rating;
    } else {
      return 0;
    }
  }

  async getRatetingByShopId(id: string) {
   
  }
  async getReviewByIdProduct (id: string) {
    const productReviews = await this.productReviewModel.find({productId: id.toString()})
    .populate({
      path: 'customerId',
      select: 'name phone avata',})
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
    })
    return productReviews;
  }
  async getRateingByIdShop(id: string) {
    try {
      const listReview = await this.productReviewModel
      .find()
      .populate({
        path: 'productId',
      })
      .populate({
        path: 'customerId',
        select: 'name phone avata',
      })
      .lean()
      .exec();
      const listReviewsByShop = listReview?.filter((item: any) => item.productId.id_shop[0].toString() === id.toString());
      const rating = listReviewsByShop.reduce((a, b) => a + b.rating, 0) / listReviewsByShop.length || 0;
      const data = {
        rating: rating.toFixed(1),
        listReview: listReviewsByShop
      }
      return data;
    }
    catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
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
