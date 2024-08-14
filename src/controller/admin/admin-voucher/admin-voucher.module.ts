import { Module } from '@nestjs/common';
import { AdminVoucherService } from './admin-voucher.service';
import { AdminVoucherController } from './admin-voucher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminVoucherSchemas } from './schemas/admin-voucher.schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'AdminVoucher', schema: AdminVoucherSchemas }]),
  ],
  controllers: [AdminVoucherController],
  providers: [AdminVoucherService],
  exports: [AdminVoucherService]
})
export class AdminVoucherModule {}
