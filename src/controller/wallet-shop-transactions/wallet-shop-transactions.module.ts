import { Module } from '@nestjs/common';
import { WalletShopTransactionsService } from './wallet-shop-transactions.service';
import { WalletShopTransactionsController } from './wallet-shop-transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WalletShopTransactions,
  WalletShopTransactionsSchema,
} from './schemas/wallet-shop-transactions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WalletShopTransactions.name,
        schema: WalletShopTransactionsSchema,
      },
    ]),
  ],
  controllers: [WalletShopTransactionsController],
  providers: [WalletShopTransactionsService],
  exports: [WalletShopTransactionsService],
})
export class WalletShopTransactionsModule {}
