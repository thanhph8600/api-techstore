import { Module } from '@nestjs/common';
import { WalletAdminService } from './wallet-admin.service';
import { WalletAdminController } from './wallet-admin.controller';

@Module({
  controllers: [WalletAdminController],
  providers: [WalletAdminService],
})
export class WalletAdminModule {}
