import { Module } from '@nestjs/common';
import { ItemsSubOrderService } from './items-sub-order.service';
import { ItemsSubOrderController } from './items-sub-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ItemsSubOrder,
  ItemsSubOrderSchema,
} from './schemas/itemsSubOrder.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemsSubOrder.name, schema: ItemsSubOrderSchema },
    ]),
  ],
  controllers: [ItemsSubOrderController],
  providers: [ItemsSubOrderService],
  exports: [ItemsSubOrderService],
})
export class ItemsSubOrderModule {}
