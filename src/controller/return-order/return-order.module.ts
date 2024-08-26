import { Module } from '@nestjs/common';
import { ReturnOrderService } from './return-order.service';
import { ReturnOrderController } from './return-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReturnOrderSchema } from './schemas/return-order.schema';
import { ItemsOrderModule } from '../items-order/items-order.module';
import { NotificationModule } from '../notification/notification.module';
import { WalletModule } from '../wallet/wallet.module';

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
    WalletModule,
  ],
  controllers: [ReturnOrderController],
  providers: [ReturnOrderService],
  exports: [ReturnOrderService],
})
export class ReturnOrderModule {}
