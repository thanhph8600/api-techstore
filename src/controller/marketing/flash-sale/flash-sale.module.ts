import { Module } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import { FlashSaleController } from './flash-sale.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { FlashSale, FlashSaleSchema } from './schemas/flashSale.schema';
import {
  FlashSaleDetail,
  FlashSaleDetailSchema,
} from './schemas/flashSale_detail';
import { ShopModule } from 'src/controller/seller/shop/shop.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FlashSale.name,
        schema: FlashSaleSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: FlashSaleDetail.name,
        schema: FlashSaleDetailSchema,
      },
    ]),
    ShopModule,
  ],
  controllers: [FlashSaleController],
  providers: [FlashSaleService],
})
export class FlashSaleModule {}
