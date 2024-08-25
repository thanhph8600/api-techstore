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

@Injectable()
export class ShopService {
  constructor(
    @InjectModel('Shop') private readonly shopModule: Model<ShopDocument>,
    private readonly customerService: CustomerService,
    private banShopService: BanShopService,
    private readonly customerFollowService: CustomerFollowService,
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

  async findAll() {
    return await this.shopModule.find();
  }

  async countShop() {
    return await this.shopModule.estimatedDocumentCount()
  }

  async findById(id: string): Promise<Shop> {
    try {
      const shop = await this.shopModule.findById(id).populate('id_customer');
      if (!shop) throw new Error('Shop khong ton tai!');
      const followers = await this.customerFollowService.findByShopId(id);
      if (followers.length > 0) shop.count_follower = followers.length;
      shop.follows = followers.map((follow) => follow.customerId);
      return handleThumbnail(shop);
    } catch (error) {
      throw new InternalServerErrorException();
    }
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
    console.log(query);
    const shop = await this.shopModule
      .find({
        name: { $regex: 'ao ba lo', $options: 'i' },
      })
      .select('name')
      .exec();
    return shop;
  }

  async updateCreatedAtById(id: string, newCreatedAt: Date): Promise<void> {
    await this.shopModule.updateOne(
      { _id: id },
      { $set: { createdAt: newCreatedAt } }
    );
  }


  async countShopsCreatedInMonth(year: number, month: number): Promise<number> {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);

    return this.shopModule.countDocuments({
      createdAt: { $gte: startOfMonth, $lt: endOfMonth },
    });
  }

  async addCreatedAtToExistingShops(): Promise<void> {
    const currentDate = new Date();

    // Cập nhật tất cả các tài liệu mà không có trường createdAt
    await this.shopModule.updateMany(
      { createdAt: { $exists: false } }, // Chỉ cập nhật các tài liệu không có createdAt
      { $set: { createdAt: currentDate } } // Đặt giá trị createdAt là ngày hiện tại
    );
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
