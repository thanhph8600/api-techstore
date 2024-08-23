import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAddressShopDto } from './dto/create-address-shop.dto';
import { UpdateAddressShopDto } from './dto/update-address-shop.dto';
import { payload } from '../customer/interface/customer.interface';
import { InjectModel } from '@nestjs/mongoose';
import { AddressShop } from './schemas/address-shop.schemas';
import { Model } from 'mongoose';
import { ShopService } from '../seller/shop/shop.service';

@Injectable()
export class AddressShopService {
  constructor(
    @InjectModel(AddressShop.name)
    private readonly addressShopModel: Model<AddressShop>,
    private readonly shopService: ShopService,
  ) {}
  async create(create: CreateAddressShopDto, payload: payload) {
    const shop = await this.shopService.create(payload);
    const addressShop = await this.addressShopModel.findOne({
      id_shop: String(shop._id),
    });
    if (addressShop) {
      return await this.addressShopModel.findByIdAndUpdate(
        String(addressShop._id),
        create,
      );
    }
    create.id_shop = String(shop._id);
    const newAddress = await this.addressShopModel.create(create);
    return newAddress;
  }

  async findByIdShop(id: string) {
    const address = await this.addressShopModel.findOne({ id_shop: id });
    return address;
  }

  async update(id: string, update: UpdateAddressShopDto, payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      const address = await this.addressShopModel.findOne({
        id_shop: String(shop._id),
      });
      if (address) {
        return await this.addressShopModel.findByIdAndUpdate(
          String(address._id),
          update,
        );
      }
      const newAddress = await this.addressShopModel.create(update);
      return newAddress;
    } catch (error) {
      console.log(error);
      return new InternalServerErrorException();
    }
  }
}
