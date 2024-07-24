import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './middleware/auth/auth.module';
import { CustomerModule } from './controller/customer/customer.module';
import { ProductModule } from './controller/product/product.module';
import { ShopModule } from './controller/seller/shop/shop.module';
import { IdentificationModule } from './controller/seller/identification/identification.module';
import { CategoryModule } from './controller/category/category.module';
import { CategoryDetailModule } from './controller/category-detail/category-detail.module';
import { BrandModule } from './controller/brand/brand.module';
import { SpecificationModule } from './controller/specification/main/specification.module';
import { ProductPriceModule } from './controller/variation/product-price/product-price.module';
import { UploadModule } from './middleware/upload/upload.module';
import mongoose from 'mongoose';
import { CartModule } from './controller/cart/cart.module';
import { CartSelectModule } from './controller/cart-select/cart-select.module';
import { OrderModule } from './controller/order/order.module';
import { SubOrderModule } from './controller/sub-order/sub-order.module';
import { SearchQueryModule } from './controller/search-query/search-query.module';
import { HistorySearchModule } from './controller/history-search/history-search.module';
import { CustomerRewardModule } from './controller/customer-reward/customer-reward.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGGO_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CustomerModule,
    ShopModule,
    ProductModule,
    IdentificationModule,
    CategoryModule,
    CategoryDetailModule,
    BrandModule,
    SpecificationModule,
    ProductPriceModule,
    UploadModule,
    CartModule,
    CartSelectModule,
    OrderModule,
    SubOrderModule,
    SearchQueryModule,
    HistorySearchModule,
    CustomerRewardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    mongoose.set('strictPopulate', false);
    console.log('Connected to MongoDB');
  }
}
