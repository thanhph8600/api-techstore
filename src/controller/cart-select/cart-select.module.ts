import { Module } from '@nestjs/common';
import { CartSelectService } from './cart-select.service';
import { CartSelectController } from './cart-select.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSelect, CartSelectSchema } from './schemas/cartSelect.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CartSelect.name, schema: CartSelectSchema }]),
  ],
  controllers: [CartSelectController],
  providers: [CartSelectService],
  exports: [CartSelectService],
})
export class CartSelectModule {}
