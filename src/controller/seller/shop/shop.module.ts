import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shop } from './entities/shop.entity';
import { shopSchema } from './schemas/shop.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shop.name, schema: shopSchema }]),
  ],
  controllers: [ShopController],
  providers: [ShopService],
})
export class ShopModule {}
