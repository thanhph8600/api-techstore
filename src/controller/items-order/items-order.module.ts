import { Module } from '@nestjs/common';
import { ItemsOrderService } from './items-order.service';
import { ItemsOrderController } from './items-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsOrder, ItemsOrderSchema } from './schemas/itemsOrder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ItemsOrder.name, schema: ItemsOrderSchema }]),
  ],
  controllers: [ItemsOrderController],
  providers: [ItemsOrderService],
  exports: [ItemsOrderService],
})
export class ItemsOrderModule {}
