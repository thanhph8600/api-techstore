import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';
import { ShopModule } from '../seller/shop/shop.module';
import {
  ProductSpecification,
  ProductSpecificationSchema,
} from './schemas/product_specification.schema';
import { ProductPriceModule } from '../variation/product-price/product-price.module';
import { CategoryDetailModule } from '../category-detail/category-detail.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductSpecification.name, schema: ProductSpecificationSchema },
    ]),
    ShopModule,
    ProductPriceModule,
    CategoryDetailModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
