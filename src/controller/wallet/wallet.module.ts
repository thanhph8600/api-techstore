import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletSchema } from './schemas/wallet.schema';
import { WalletTransactionsModule } from '../wallet-transactions/wallet-transactions.module';
import { NotificationModule } from '../notification/notification.module';
import { CardLinkModule } from '../card-link/card-link.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Wallet', schema: WalletSchema }]),
    WalletTransactionsModule,
    NotificationModule,
    CardLinkModule
  ],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
