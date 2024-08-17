import { Module } from '@nestjs/common';
import { ItemsOrderService } from './items-order.service';
import { ItemsOrderController } from './items-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsOrder, ItemsOrderSchema } from './schemas/itemsOrder.schema';
import { ShopModule } from '../seller/shop/shop.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemsOrder.name, schema: ItemsOrderSchema },
    ]),
    ShopModule,
  ],
  controllers: [ItemsOrderController],
  providers: [ItemsOrderService],
  exports: [ItemsOrderService],
})
export class ItemsOrderModule {}
