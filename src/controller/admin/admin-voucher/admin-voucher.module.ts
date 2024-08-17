import { Module } from '@nestjs/common';
import { AdminVoucherService } from './admin-voucher.service';
import { AdminVoucherController } from './admin-voucher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminVoucherSchemas } from './schemas/admin-voucher.schemas';
import { VoucherWallet, VoucherWalletSchemas } from 'src/controller/voucher-wallet/schemas/voucher-wallet.schemas';
import { VoucherWalletService } from 'src/controller/voucher-wallet/voucher-wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: 'AdminVoucher', schema: AdminVoucherSchemas},
      {name: VoucherWallet.name, schema: VoucherWalletSchemas}])
  ],
  controllers: [AdminVoucherController],
  providers: [AdminVoucherService,VoucherWalletService],
  exports: [AdminVoucherService,VoucherWalletService]
})
export class AdminVoucherModule {}
