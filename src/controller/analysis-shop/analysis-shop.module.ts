import { Module } from '@nestjs/common';
import { AnalysisShopService } from './analysis-shop.service';
import { AnalysisShopController } from './analysis-shop.controller';
import { ShopModule } from '../seller/shop/shop.module';
import { ItemsOrderModule } from '../items-order/items-order.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ShopModule, ItemsOrderModule, ProductModule],
  controllers: [AnalysisShopController],
  providers: [AnalysisShopService],
})
export class AnalysisShopModule {}
