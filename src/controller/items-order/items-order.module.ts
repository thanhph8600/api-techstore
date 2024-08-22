import { Module } from '@nestjs/common';
import { ItemsOrderService } from './items-order.service';
import { ItemsOrderController } from './items-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsOrder, ItemsOrderSchema } from './schemas/itemsOrder.schema';
import { ShopModule } from '../seller/shop/shop.module';
import { ProductPriceModule } from '../variation/product-price/product-price.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemsOrder.name, schema: ItemsOrderSchema },
    ]),
    ShopModule,
    ProductPriceModule,
    NotificationModule,
  ],
  controllers: [ItemsOrderController],
  providers: [ItemsOrderService],
  exports: [ItemsOrderService],
})
export class ItemsOrderModule {}
