import { Module } from '@nestjs/common';
import { AddressShopService } from './address-shop.service';
import { AddressShopController } from './address-shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AddressShop, AddressShopSchema } from './schemas/address-shop.schemas';
import { ShopModule } from '../seller/shop/shop.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AddressShop.name, schema: AddressShopSchema },
    ]),
    ShopModule,
  ],
  controllers: [AddressShopController],
  providers: [AddressShopService],
  exports: [AddressShopService, AddressShopModule],
})
export class AddressShopModule {}
