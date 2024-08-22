import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop } from './entities/shop.entity';
import { shopSchema } from './schemas/shop.schema';
import { CustomerModule } from 'src/controller/customer/customer.module';
import { BanShopService } from 'src/controller/ban_shop/ban_shop.service';
import { BanShopSchema } from 'src/controller/ban_shop/schemas/ban_shop.schemas';
import { CustomerFollowModule } from 'src/controller/customer-follow/customer-follow.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: shopSchema }]),
    CustomerModule,
    MongooseModule.forFeature([{ name: 'BanShop', schema: BanShopSchema }]),
    CustomerFollowModule,
  ],
  controllers: [ShopController],
  providers: [ShopService, BanShopService],
  exports: [ShopService],
})
export class ShopModule {}
