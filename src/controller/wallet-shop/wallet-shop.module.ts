import { Module } from '@nestjs/common';
import { WalletShopService } from './wallet-shop.service';
import { WalletShopController } from './wallet-shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletShop, WalletShopSchema } from './schemas/walletShop.schema';
import { ShopModule } from '../seller/shop/shop.module';
import { NotificationModule } from '../notification/notification.module';
import { WalletShopTransactionsModule } from '../wallet-shop-transactions/wallet-shop-transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletShop.name, schema: WalletShopSchema },
    ]),
    ShopModule,
    WalletShopTransactionsModule,
    NotificationModule,
  ],
  controllers: [WalletShopController],
  providers: [WalletShopService],
  exports: [WalletShopService],
})
export class WalletShopModule {}
