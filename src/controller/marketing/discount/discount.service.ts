import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Discount } from './schemas/discount.schema';
import { DiscountDetail } from './schemas/discount-detail';
import { ShopService } from 'src/controller/seller/shop/shop.service';
import { payload } from 'src/controller/customer/interface/customer.interface';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(Discount.name) private readonly discountModel: Model<Discount>,
    @InjectModel(DiscountDetail.name)
    private readonly discountDetailModel: Model<Discount>,
    private readonly shopService: ShopService,
  ) { }
  async create(createDiscountDto: CreateDiscountDto[], payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      createDiscountDto[0].id_shop = shop._id;
      const newDiscount = await this.discountModel.create(createDiscountDto[0]);
      createDiscountDto.map((item) => {
        const newDiscountDetail = {
          ...item,
          id_discocunt: newDiscount._id,
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
      return this.discountModel
        .findById(id)
        .populate({
          path: 'discount_detail',
          populate: {
            path: 'id_productPrice',
            populate: [
              { path: 'id_color' },
              { path: 'id_size' },
              { path: 'id_product' },
            ],
          },
        })
        .lean();
    } catch (error) {
      console.log('error findByIdDiscount discount');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneByIdProductPrice(id: string) {
    const id_productPrice = new Types.ObjectId(id);
    try {
      const discountDetail = await this.discountDetailModel.findOne({id_productPrice: id_productPrice})
      .populate({
        path: 'id_discocunt',
        select: 'time_start time_end',
      })
      return discountDetail;
    } catch (error) {
      console.log('error findOne discount');
      console.log(error);
      throw new InternalServerErrorException();
    }
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
      await this.discountDetailModel.deleteMany({ id_discocunt: id });
      await this.discountModel.findByIdAndDelete(id);
      return new HttpException('Xóa thành công!', HttpStatus.OK);
    } catch (error) {
      console.log('error delete discount');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
