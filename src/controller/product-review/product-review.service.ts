import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { ProductReview } from './schemas/product-review.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ItemsOrderService } from '../items-order/items-order.service';
import { CustomerRewardService } from '../customer-reward/customer-reward.service';
import { payload } from '../customer/interface/customer.interface';
import { ShopService } from '../seller/shop/shop.service';
@Injectable()
export class ProductReviewService {
  constructor(
    @InjectModel(ProductReview.name)
    private readonly productReviewModel: Model<ProductReview>,
    private readonly itemsOrderService: ItemsOrderService,
    private readonly customerRewartService: CustomerRewardService,
    private readonly shopService: ShopService,
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

  async findById(id: string) {
    const review = await this.productReviewModel
      .findById(id)
      .populate('productId')
      .populate('ProductReviewReply')
      .lean()
      .exec();
    return review;
  }

  async findByShop(payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      const listReview = await this.productReviewModel
        .find()
        .sort({ created: -1 })
        .populate({
          path: 'productId',
        })
        .populate('ProductReviewReply')
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
        })
        .lean()
        .exec();
      const checkByIdShop = this.handleListReviewByIdShop(listReview, shop._id);
      return this.handleThumbnailListReview(checkByIdShop);
    } catch (error) {
      console.log('error cartSlecte remove', error);
      throw new InternalServerErrorException();
    }
  }
  handleListReviewByIdShop(listReview, id_shop: string) {
    return listReview.filter((item) => {
      return String(item.productId.id_shop[0]) === String(id_shop);
    });
  }
  handleThumbnailListReview(listReview) {
    if (listReview && listReview.length > 0) {
      return listReview.map((item) => {
        if (
          item.productId &&
          item.productId.thumbnails &&
          item.productId.thumbnails.length > 0
        ) {
          const thumbnail = item.productId.thumbnails[0];
          if (
            !thumbnail.startsWith('http://') &&
            !thumbnail.startsWith('https://')
          ) {
            item.productId.thumbnails[0] = `${process.env.URL_API}uploads/${thumbnail}`;
          }
        }
        if (item.customerId && item.customerId.avata) {
          const thumbnail = item.customerId.avata;
          if (
            !thumbnail.startsWith('http://') &&
            !thumbnail.startsWith('https://')
          ) {
            item.customerId.avata = `${process.env.URL_API}uploads/${thumbnail}`;
          }
        }
        if (item.images && item.images.length > 0) {
          const newImage = item.images.map((image) => {
            if (!image.startsWith('http://') && !image.startsWith('https://')) {
              return `${process.env.URL_API}uploads/${image}`;
            }
          });
          item.images = newImage;
        }
        return item;
      });
    }
    return listReview;
  }

  update(id: number, updateProductReviewDto: UpdateProductReviewDto) {
    console.log(updateProductReviewDto);
    return `This action updates a #${id} productReview`;
  }

  remove(id: number) {
    return `This action removes a #${id} productReview`;
  }
}
