import { Module } from '@nestjs/common';
import { WalletTransactionsService } from './wallet-transactions.service';
import { WalletTransactionsController } from './wallet-transactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletTransactionsSchema } from './schemas/wallet-transactions.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'WalletTransactions', schema: WalletTransactionsSchema },
    ])
  ],
  controllers: [WalletTransactionsController],
  providers: [WalletTransactionsService],
  exports: [WalletTransactionsService]
})
export class WalletTransactionsModule {}
