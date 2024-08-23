import { Module } from '@nestjs/common';
import { ReturnOrderService } from './return-order.service';
import { ReturnOrderController } from './return-order.controller';

@Module({
  controllers: [ReturnOrderController],
  providers: [ReturnOrderService],
})
export class ReturnOrderModule {}
