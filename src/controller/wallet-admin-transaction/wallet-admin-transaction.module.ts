import { Module } from '@nestjs/common';
import { WalletAdminTransactionService } from './wallet-admin-transaction.service';
import { WalletAdminTransactionController } from './wallet-admin-transaction.controller';

@Module({
  controllers: [WalletAdminTransactionController],
  providers: [WalletAdminTransactionService],
})
export class WalletAdminTransactionModule {}
