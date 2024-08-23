import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { ItemsOrderModule } from '../items-order/items-order.module';
import { ProductPriceModule } from '../variation/product-price/product-price.module';
import { SubOrderModule } from '../sub-order/sub-order.module';
import { CartModule } from '../cart/cart.module';
import { CustomerRewardModule } from '../customer-reward/customer-reward.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ItemsOrderModule,
    ProductPriceModule,
    SubOrderModule,
    CartModule,
    CustomerRewardModule,
    WalletModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
