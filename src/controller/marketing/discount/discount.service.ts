import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Discount } from './schemas/discount.schema';
import { DiscountDetail } from './schemas/discount-detail';
import { ShopService } from 'src/controller/seller/shop/shop.service';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { handleThumbnailListProduct } from 'src/controller/product/product.service';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private readonly discountModel: Model<Discount>,
    @InjectModel(DiscountDetail.name)
    private readonly discountDetailModel: Model<Discount>,
    private readonly shopService: ShopService,
  ) {}
  async create(createDiscountDto: CreateDiscountDto[], payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      createDiscountDto[0].id_shop = shop._id;
      const newDiscount = await this.discountModel.create(createDiscountDto[0]);
      createDiscountDto.map((item) => {
        const newDiscountDetail = {
          ...item,
          id_discount: newDiscount._id,
        };
        this.discountDetailModel.create(newDiscountDetail);
      });
    } catch (error) {
      console.log('error creacte discount');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return this.discountModel
      .find()
      .populate({
        path: 'discount_detail',
        populate: {
          path: 'id_productPrice',
          populate: [{ path: 'id_color' }, { path: 'id_size' }],
        },
      })
      .lean();
  }

  async findByIdShop(payload: payload) {
    const shop = await this.shopService.create(payload);
    return this.discountModel
      .find({ id_shop: shop._id })
      .sort({ created: -1 })
      .populate({
        path: 'discount_detail',
        populate: {
          path: 'id_productPrice',
          populate: [{ path: 'id_color' }, { path: 'id_size' }],
        },
      })
      .lean();
  }

  async findByIdDiscount(id: string) {
    try {
      const discount = await this.discountModel
        .findById({ _id: id })
        .populate({
          path: 'discount_detail',
          populate: {
            path: 'id_productPrice',
            populate: [{ path: 'id_color' }, { path: 'id_size' }],
          },
        })
        .lean();
      return discount;
    } catch (error) {
      console.log('error findByIdDiscount discount');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} discount`;
  }

  async update(
    id: string,
    updateDiscountDto: UpdateDiscountDto,
    payload: payload,
  ) {
    try {
      const discount = await this.discountModel.findById(id);
      const shop = await this.shopService.create(payload);
      if (String(discount.id_shop) != String(shop._id)) {
        return new HttpException(
          'Không thể cập nhật discount của shop khác!',
          HttpStatus.FORBIDDEN,
        );
      }
      const newDiscount = this.discountModel.findByIdAndUpdate(
        id,
        updateDiscountDto,
      );
      return newDiscount;
    } catch (error) {
      console.log('error update discount');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, payload: payload) {
    try {
      const discount = await this.discountModel.findById(id);
      const shop = await this.shopService.create(payload);
      if (String(discount.id_shop) != String(shop._id)) {
        return new HttpException(
          'Không thể xóa discount của shop khác!',
          HttpStatus.FORBIDDEN,
        );
      }
      await this.discountDetailModel.deleteMany({ id_discount: id });
      await this.discountModel.findByIdAndDelete(id);
      return new HttpException('Xóa thành công!', HttpStatus.OK);
    } catch (error) {
      console.log('error delete discount');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  handleThumbnailListDiscount(listDiscount) {
    return listDiscount.map((itemDiscount) => {
      return this.handleThumbnailDiscount(itemDiscount);
    });
  }
  handleThumbnailDiscount(discount) {
    discount.discount_detail.map((itemDiscountDetail) => {
      return (itemDiscountDetail.id_productPrice.id_product =
        handleThumbnailListProduct(
          itemDiscountDetail.id_productPrice.id_product,
        ));
    });
    return discount;
  }
}
