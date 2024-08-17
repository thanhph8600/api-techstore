import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';
import { CartService } from '../cart/cart.service';
import { VoucherWallet, VoucherWalletSchemas } from '../voucher-wallet/schemas/voucher-wallet.schemas';
import { VoucherWalletService } from '../voucher-wallet/voucher-wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Cart.name, schema: CartSchema },
      { name: VoucherWallet.name, schema: VoucherWalletSchemas },
    ]),
    // MongooseModule.forFeature([{name: 'VoucherWallet', schema: VoucherWalletSchemas}])
    // MulterModule.register({
    //   dest: './uploads'
    // })
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CartService,VoucherWalletService],
  exports: [CustomerService, CartService,VoucherWalletService]
})
export class CustomerModule {}
