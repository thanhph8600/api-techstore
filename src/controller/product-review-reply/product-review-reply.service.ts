import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductReviewReplyDto } from './dto/create-product-review-reply.dto';
import { UpdateProductReviewReplyDto } from './dto/update-product-review-reply.dto';
import { payload } from '../customer/interface/customer.interface';
import { InjectModel } from '@nestjs/mongoose';
import { ProductReviewReply } from './schemas/product-review-reply.schema';
import { Model } from 'mongoose';
import { ShopService } from '../seller/shop/shop.service';
import { ProductReviewService } from '../product-review/product-review.service';

@Injectable()
export class ProductReviewReplyService {
  constructor(
    @InjectModel(ProductReviewReply.name)
    private readonly replyReviewModel: Model<ProductReviewReply>,
    private readonly shopService: ShopService,
    private readonly productReview: ProductReviewService,
  ) {}
  async create(payload: payload, create: CreateProductReviewReplyDto) {
    try {
      const shop = await this.shopService.create(payload);
      const review = await this.productReview.findById(create.id_productReview);
      if (!this.checkShopIdInReview(shop._id, review))
        return new HttpException(
          'Bạn không phải là người bán',
          HttpStatus.CONFLICT,
        );
      if (!this.checkIsReply(review))
        return new HttpException(
          'Bạn đã trả lời bình luận này rồi!',
          HttpStatus.CONFLICT,
        );
      create.id_shop = shop._id;
      const newReply = await this.replyReviewModel.create(create);
      return newReply;
    } catch (error) {
      console.log('error create ProductReviewReplyService', error);
      throw new InternalServerErrorException();
    }
  }
  checkShopIdInReview(id_shop: string, review) {
    if (String(id_shop) === String(review.productId.id_shop[0])) return true;
  }
  checkIsReply(review) {
    if (!review.ProductReviewReply || review.ProductReviewReply.length === 0)
      return true;
  }

  async update(
    id: string,
    update: UpdateProductReviewReplyDto,
    payload: payload,
  ) {
    try {
      const shop = await this.shopService.create(payload);
      const replyReview = await this.replyReviewModel.findById(id);
      if (!replyReview)
        return new HttpException(
          'Không tìm thấy review!',
          HttpStatus.NOT_FOUND,
        );
      if (String(shop._id) !== String(replyReview.id_shop))
        return new HttpException(
          'Bạn không có quyền cập nhật nội dung này!',
          HttpStatus.CONFLICT,
        );
      const newReply = await this.replyReviewModel.findByIdAndUpdate(
        id,
        update,
      );
      return newReply;
    } catch (error) {
      console.log('error update ProductReviewReplyService', error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      const replyReview = await this.replyReviewModel.findById(id);
      if (!replyReview)
        return new HttpException(
          'Không tìm thấy review!',
          HttpStatus.NOT_FOUND,
        );
      if (String(shop._id) !== String(replyReview.id_shop))
        return new HttpException(
          'Bạn không có quyền xóa nội dung này!',
          HttpStatus.CONFLICT,
        );
      await this.replyReviewModel.findByIdAndDelete(id);
      return new HttpException('Xóa thành công', HttpStatus.NO_CONTENT);
    } catch (error) {
      console.log('error remove ProductReviewReplyService', error);
      throw new InternalServerErrorException();
    }
  }
}
