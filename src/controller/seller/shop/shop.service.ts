import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './entities/shop.entity';
import { CustomerService } from 'src/controller/customer/customer.service';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { BanShopService } from 'src/controller/ban_shop/ban_shop.service';
import { CustomerFollowService } from 'src/controller/customer-follow/customer-follow.service';
import { ShopDocument } from './schemas/shop.schema';
import { ShopView } from './schemas/shop-view.schema';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel('Shop') private readonly shopModule: Model<ShopDocument>,
    private readonly customerService: CustomerService,
    private banShopService: BanShopService,
    private readonly customerFollowService: CustomerFollowService,
    @InjectModel(ShopView.name)
    private readonly shopViewModule: Model<ShopView>,
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
    await this.banShopService.create({
      id_shop: shop.id,
      reasonBan: '',
      banStartDate: new Date(),
      banEndDate: new Date(),
    });

    return shop;
  }

  async createViewShop(id_shop: string) {
    try {
      const shop = await this.shopModule.findById(id_shop);
      if (shop) {
        return await this.shopViewModule.create({ id_shop });
      }
    } catch (error) {
      console.log('error createViewProduct');
      console.log(error);
      return new InternalServerErrorException();
    }
  }

  async findAll() {
    return await this.shopModule.find();
  }

  async findById(id: string): Promise<Shop> {
    try {
      const shop = await this.shopModule
        .findById(id)
        .populate('id_customer')
        .populate('addressShop')
        .populate('ShopView')
        .lean()
        .exec();
      if (!shop) throw new Error('Shop khong ton tai!');
      const followers = await this.customerFollowService.findByShopId(id);
      if (followers.length > 0) shop.count_follower = followers.length;
      shop.follows = followers.map((follow) => follow.customerId);
      return handleThumbnail(shop);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findByCustomer(payload: payload) {
    try {
      const shop = await this.create(payload);
      const profile = await this.shopModule
        .findById(String(shop._id))
        .populate('id_customer')
        .populate('AddressShop')
        .exec();
      if (!profile) throw new Error('Shop khong ton tai!');
      const followers = await this.customerFollowService.findByShopId(
        String(shop._id),
      );
      if (followers.length > 0) profile.count_follower = followers.length;
      profile.follows = followers.map((follow) => follow.customerId);
      return handleThumbnail(profile);
    } catch (error) {
      throw new InternalServerErrorException();
    }
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
    console.log(query);
    const shop = await this.shopModule
      .find({
        name: { $regex: 'ao ba lo', $options: 'i' },
      })
      .select('name')
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
