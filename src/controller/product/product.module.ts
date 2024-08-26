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
import { UploadModule } from 'src/middleware/upload/upload.module';
import { DiscountModule } from '../marketing/discount/discount.module';
import { ProductReviewModule } from '../product-review/product-review.module';
import { ItemsOrderModule } from '../items-order/items-order.module';
import { ProductView, ProductViewSchema } from './schemas/product-view.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([
      { name: ProductSpecification.name, schema: ProductSpecificationSchema },
    ]),
    MongooseModule.forFeature([
      { name: ProductView.name, schema: ProductViewSchema },
    ]),
    ShopModule,
    ProductPriceModule,
    CategoryDetailModule,
    UploadModule,
    DiscountModule,
    ProductReviewModule,
    ItemsOrderModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
