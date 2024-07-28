import { Module } from '@nestjs/common';
import { SubOrderService } from './sub-order.service';
import { SubOrderController } from './sub-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubOrder, SubOrderSchema } from './schemas/sub-order.schema';
import { CustomerRewardModule } from '../customer-reward/customer-reward.module';
import { VoucherModule } from '../marketing/voucher/voucher.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubOrder.name, schema: SubOrderSchema }
    ]),
    CustomerRewardModule,
    VoucherModule
  ],
  controllers: [SubOrderController],
  providers: [SubOrderService],
})
export class SubOrderModule {}
