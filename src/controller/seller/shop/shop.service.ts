import { Injectable } from '@nestjs/common';
import { UpdateShopDto } from './dto/update-shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shop } from './entities/shop.entity';
import { CustomerService } from 'src/controller/customer/customer.service';

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
      return checkShop;
    }
    const newShop = {
      id_customer: payload.sub,
      name: payload.username,
      thumbnail: payload.avata,
    };
    return await this.shopModule.create(newShop);
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

  update(id: number, updateShopDto: UpdateShopDto) {
    console.log(updateShopDto);
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
