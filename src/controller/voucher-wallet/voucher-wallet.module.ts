import { Module } from '@nestjs/common';
import { VoucherWalletService } from './voucher-wallet.service';
import { VoucherWalletController } from './voucher-wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherWalletSchemas } from './schemas/voucher-wallet.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'VoucherWallet', schema: VoucherWalletSchemas },
    ]),
  ],
  controllers: [VoucherWalletController],
  providers: [VoucherWalletService],
  exports: [VoucherWalletService]
})
export class VoucherWalletModule {}
