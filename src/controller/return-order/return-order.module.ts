import { Module } from '@nestjs/common';
import { ReturnOrderService } from './return-order.service';
import { ReturnOrderController } from './return-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnOrderSchema } from './schemas/return-order.schema';
import { ItemsOrderModule } from '../items-order/items-order.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'ReturnOrder',
        schema: ReturnOrderSchema,
      },
    ]),
    ItemsOrderModule,
    NotificationModule,
  ],
  controllers: [ReturnOrderController],
  providers: [ReturnOrderService],
})
export class ReturnOrderModule {}
