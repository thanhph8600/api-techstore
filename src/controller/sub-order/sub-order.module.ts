import { Module } from '@nestjs/common';
import { SubOrderService } from './sub-order.service';
import { SubOrderController } from './sub-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubOrder, SubOrderSchema } from './schemas/sub-order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubOrder.name, schema: SubOrderSchema }
    ])
  ],
  controllers: [SubOrderController],
  providers: [SubOrderService],
})
export class SubOrderModule {}
