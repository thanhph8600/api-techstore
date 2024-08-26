import { forwardRef, Module } from '@nestjs/common';
import { ItemsOrderService } from './items-order.service';
import { ItemsOrderController } from './items-order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ItemsOrder, ItemsOrderSchema } from './schemas/itemsOrder.schema';
import { ShopModule } from '../seller/shop/shop.module';
import { ProductPriceModule } from '../variation/product-price/product-price.module';
import { NotificationModule } from '../notification/notification.module';
import { WalletModule } from '../wallet/wallet.module';
import { CustomerRewardModule } from '../customer-reward/customer-reward.module';
import { VoucherModule } from '../marketing/voucher/voucher.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ItemsOrder.name, schema: ItemsOrderSchema },
    ]),
    ShopModule,
    ProductPriceModule,
    NotificationModule,
    WalletModule,
    CustomerRewardModule,
    VoucherModule,
  ],
  controllers: [ItemsOrderController],
  providers: [ItemsOrderService],
  exports: [ItemsOrderService],
})
export class ItemsOrderModule { }
