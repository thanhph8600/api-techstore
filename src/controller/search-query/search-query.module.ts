import { ShopModule } from './../seller/shop/shop.module';
import { Module } from '@nestjs/common';
import { SearchQueryService } from './search-query.service';
import { SearchQueryController } from './search-query.controller';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [ShopModule , ProductModule, CategoryModule],
  controllers: [SearchQueryController],
  providers: [SearchQueryService],
})
export class SearchQueryModule {}
