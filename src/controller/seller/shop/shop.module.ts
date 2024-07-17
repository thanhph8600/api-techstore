import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop } from './entities/shop.entity';
import { shopSchema } from './schemas/shop.schema';
import { CustomerModule } from 'src/controller/customer/customer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: shopSchema }]),
    CustomerModule,
  ],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
