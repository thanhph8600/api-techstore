import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher } from './schemas/voucher.schema';
import { Model } from 'mongoose';
import { ShopService } from 'src/controller/seller/shop/shop.service';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { handleThumbnailListProduct } from 'src/controller/product/product.service';

@Injectable()
export class VoucherService {
  constructor(
    @InjectModel(Voucher.name) private readonly voucherModel: Model<Voucher>,
    private readonly shopService: ShopService,
  ) {}
  async create(create: CreateVoucherDto, payload: payload) {
    try {
      const checkCode = await this.voucherModel.findOne({ code: create.code });
      if (checkCode) {
        return new HttpException(
          'Mã voucher không được trùng nhau!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const shop = await this.shopService.create(payload);
      create.id_shop = shop._id;
      const newVoucher = await this.voucherModel.create(create);
      return newVoucher;
    } catch (error) {
      console.log('error creacte voucher');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const listVoucher = await this.voucherModel
      .find()
      .populate('id_product')
      .lean()
      .exec();
    return this.handleThumbnailListVoucher(listVoucher);
  }

  async findByIdVoucher(id: string) {
    const voucher = await this.voucherModel
      .findById(id)
      .populate('id_product')
      .lean()
      .exec();
    if (voucher.id_product.length > 0) {
      voucher.id_product = handleThumbnailListProduct(voucher.id_product);
    }
    return voucher;
  }

  async findByCode(code: string) {
    const voucher = await this.voucherModel
      .findOne({ code: code })
      .populate('id_product')
      .lean()
      .exec();
    if (voucher.id_product.length > 0) {
      voucher.id_product = handleThumbnailListProduct(voucher.id_product);
    }
    return voucher;
  }

  async findByIdShop(idShop: string) {
    const listVoucher = await this.voucherModel
      .find({ id_shop: idShop })
      .populate('id_product')
      .lean()
      .exec();
    return this.handleThumbnailListVoucher(listVoucher);
  }

  async update(id: string, updateVoucherDto: UpdateVoucherDto) {
    try {
      const newVoucher = await this.voucherModel.findByIdAndUpdate(
        id,
        updateVoucherDto,
      );
      return newVoucher;
    } catch (error) {
      console.log('error update voucher');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: string) {
    try {
      this.voucherModel.findByIdAndDelete(id);
    } catch (error) {
      console.log('error update voucher');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  handleThumbnailListVoucher(listVoucher) {
    return listVoucher.map((itemVoucher) => {
      if (itemVoucher.id_product.length > 0) {
        itemVoucher.id_product = handleThumbnailListProduct(
          itemVoucher.id_product,
        );
      }
      return itemVoucher;
    });
  }
}
