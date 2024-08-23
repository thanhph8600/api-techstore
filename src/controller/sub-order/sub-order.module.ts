import { Module } from '@nestjs/common';
import { SubOrderService } from './sub-order.service';
import { SubOrderController } from './sub-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubOrder, SubOrderSchema } from './schemas/sub-order.schema';
import { CustomerRewardModule } from '../customer-reward/customer-reward.module';
import { VoucherModule } from '../marketing/voucher/voucher.module';
import { ItemsSubOrderModule } from '../items-sub-order/items-sub-order.module';
import { AdminVoucherModule } from '../admin/admin-voucher/admin-voucher.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubOrder.name, schema: SubOrderSchema },
    ]),
    CustomerRewardModule,
    VoucherModule,
    ItemsSubOrderModule,
    AdminVoucherModule
  ],
  controllers: [SubOrderController],
  providers: [SubOrderService],
  exports: [SubOrderService],
})
export class SubOrderModule {}
