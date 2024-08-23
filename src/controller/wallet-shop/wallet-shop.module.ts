import { Module } from '@nestjs/common';
import { WalletShopService } from './wallet-shop.service';
import { WalletShopController } from './wallet-shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletShop, WalletShopSchema } from './schemas/walletShop.schema';
import { ShopModule } from '../seller/shop/shop.module';
import { WalletTransactionsModule } from '../wallet-transactions/wallet-transactions.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WalletShop.name, schema: WalletShopSchema },
    ]),
    ShopModule,
    WalletTransactionsModule,
    NotificationModule,
  ],
  controllers: [WalletShopController],
  providers: [WalletShopService],
  exports: [WalletShopService],
})
export class WalletShopModule {}
