import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';
import { Cart, CartSchema } from '../cart/schemas/cart.schema';
import { CartService } from '../cart/cart.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomerSchema },
      { name: Cart.name, schema: CartSchema },
    ]),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CartService],
  exports: [CustomerService, CartService],
})
export class CustomerModule {}
