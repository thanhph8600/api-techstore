import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  CreateFlashSaleDetailDto,
  CreateFlashSaleDto,
} from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { FlashSale } from './schemas/flashSale.schema';
import { Model } from 'mongoose';
import { FlashSaleDetail } from './schemas/flashSale_detail';
import { ShopService } from 'src/controller/seller/shop/shop.service';
import { payload } from 'src/controller/customer/interface/customer.interface';

@Injectable()
export class FlashSaleService {
  constructor(
    @InjectModel(FlashSale.name)
    private readonly flashSaleModel: Model<FlashSale>,
    @InjectModel(FlashSaleDetail.name)
    private readonly flashSaleDetailModel: Model<FlashSaleDetail>,
    private readonly shopService: ShopService,
  ) {}
  async create(createFlashSaleDto: CreateFlashSaleDto, payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      createFlashSaleDto.id_shop = shop._id;
      const check = this.checkTimeStart(
        await this.findByIDShop(shop._id),
        createFlashSaleDto.time_start,
      );
      if (check.length > 0) {
        return new HttpException('Thời gian đã tồn tại!', HttpStatus.FORBIDDEN);
      }
      const newFlashSale = await this.flashSaleModel.create(createFlashSaleDto);
      return newFlashSale;
    } catch (error) {
      console.log('error create FlashSale');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async createDetail(flashSaleDetails: CreateFlashSaleDetailDto[]) {
    try {
      if (flashSaleDetails.length > 0) {
        flashSaleDetails.map(async (item) => {
          await this.flashSaleDetailModel.create(item);
        });
        return new HttpException('Tạo thành công!', HttpStatus.CREATED);
      } else if (!flashSaleDetails) {
        await this.flashSaleDetailModel.create(flashSaleDetails);
        return new HttpException('Tạo thành công!', HttpStatus.CREATED);
      }
    } catch (error) {
      console.log('error create FlashSale');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async findByIDShop(id_shop: string) {
    const flashSales = await this.flashSaleModel
      .find({ id_shop })
      .populate({
        path: 'flashSale_detail',
        populate: [{ path: 'id_productPrice' }],
      })
      .sort({ created: -1 })
      .lean()
      .exec();
    return flashSales;
  }
  checkTimeStart(listFlashSale, time_start) {
    time_start = new Date(time_start);
    const check = listFlashSale.filter((item) => {
      const time = new Date(item.time_start);
      if (time.getTime() === time_start.getTime()) {
        return item;
      }
    });
    return check;
  }
  async findDetailByIdFlashSale(id_flashSale: string) {
    try {
      const discount = await this.flashSaleModel
        .findById({ _id: id_flashSale })
        .populate({
          path: 'flashSale_detail',
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

  async findDetailByTime(time_start: string) {
    try {
      if (!time_start) {
        return new HttpException(
          'time_start not empty!',
          HttpStatus.BAD_GATEWAY,
        );
      }
      const listFlashSale = await this.flashSaleModel
        .find({
          time_start,
        })
        .populate({
          path: 'flashSale_detail',
          populate: {
            path: 'id_productPrice',
            populate: [{ path: 'id_color' }, { path: 'id_size' }],
          },
        })
        .lean()
        .exec();
      return listFlashSale;
    } catch (error) {
      console.log('error findDetailByTime FlashSale');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  findAll() {
    return `This action returns all flashSale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} flashSale`;
  }

  async update(id: string, update: UpdateFlashSaleDto, payload: payload) {
    try {
      const flashSale = await this.flashSaleModel.findById(id);
      const shop = await this.shopService.create(payload);
      if (String(flashSale.id_shop) != String(shop._id)) {
        return new HttpException(
          'Không thể cập nhật flashSale của shop khác!',
          HttpStatus.FORBIDDEN,
        );
      }
      const newFlashSale = this.flashSaleModel.findByIdAndUpdate(id, update);
      return newFlashSale;
    } catch (error) {
      console.log('error update newFlashSale');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, payload: payload) {
    try {
      const flashSale = await this.flashSaleModel.findById(id);
      const shop = await this.shopService.create(payload);
      if (String(flashSale.id_shop) != String(shop._id)) {
        return new HttpException(
          'Không thể xóa flashSale của shop khác!',
          HttpStatus.FORBIDDEN,
        );
      }
      await this.flashSaleDetailModel.deleteMany({ id_flashSale: id });
      await this.flashSaleModel.findByIdAndDelete(id);
      return new HttpException('Xóa thành công!', HttpStatus.OK);
    } catch (error) {
      console.log('error delete flashSale');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
