import { Module } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherController } from './voucher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';
import { ShopModule } from 'src/controller/seller/shop/shop.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Voucher.name,
        schema: VoucherSchema,
      },
    ]),
    ShopModule,
  ],
  controllers: [VoucherController],
  providers: [VoucherService],
  exports: [VoucherService],
})
export class VoucherModule {}
