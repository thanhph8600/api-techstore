import { Module } from '@nestjs/common';
import { BanShopService } from './ban_shop.service';
import { BanShopController } from './ban_shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BanShopSchema } from './schemas/ban_shop.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'BanShop', schema: BanShopSchema }]),
  ],
  controllers: [BanShopController],
  providers: [BanShopService],
  exports: [BanShopService],
})
export class BanShopModule {}
