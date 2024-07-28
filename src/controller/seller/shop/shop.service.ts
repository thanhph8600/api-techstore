import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './entities/shop.entity';
import { CustomerService } from 'src/controller/customer/customer.service';
import { payload } from 'src/controller/customer/interface/customer.interface';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel('Shop') private readonly shopModule: Model<Shop>,
    private readonly customerService: CustomerService,
  ) {}

  async create(payload) {
    const checkShop = await this.shopModule.findOne({
      id_customer: payload.sub,
    });
    if (checkShop) {
      return handleThumbnail(checkShop);
    }
    const newShop = {
      id_customer: payload.sub,
      name: payload.username,
      thumbnail: payload.avata,
    };
    const shop = await this.shopModule.create(newShop);
    return shop;
  }

  findAll() {
    return `This action returns all shop`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  findByCustomer(req) {
    return this.create(req.user);
  }

  async update(payload: payload, updateShopDto: UpdateShopDto) {
    try {
      console.log(updateShopDto);
      const shop = await this.create(payload);
      const newUpdate = await this.shopModule.findByIdAndUpdate(
        shop._id,
        updateShopDto,
      );
      console.log(newUpdate);
      return newUpdate;
    } catch (error) {
      console.log('error update shop' + error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
  async search(query: string) {
    const shop = await this.shopModule
      .find({
        name: { $regex: 'ao ba lo', $options: 'i' },
      }).select('name')
      .exec();
    return shop;
  }
}
export function handleThumbnail(profile) {
  if (
    !profile.thumbnail.startsWith('http://') &&
    !profile.thumbnail.startsWith('https://')
  ) {
    profile.thumbnail = `${process.env.URL_API}uploads/${profile.thumbnail}`;
  }
  return profile;
}
