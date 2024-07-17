import { Module } from '@nestjs/common';
import { ProductPriceService } from './product-price.service';
import { ProductPriceController } from './product-price.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProductPrice,
  ProductPriceSchema,
} from './schemas/productPrice.schema';
import {
  VariationColor,
  VariationColorSchema,
} from './schemas/variationColor.schema';
import {
  VariationSize,
  VariationSizeSchema,
} from './schemas/variationSize.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductPrice.name, schema: ProductPriceSchema },
    ]),
    MongooseModule.forFeature([
      { name: VariationColor.name, schema: VariationColorSchema },
    ]),
    MongooseModule.forFeature([
      { name: VariationSize.name, schema: VariationSizeSchema },
    ]),
  ],
  controllers: [ProductPriceController],
  providers: [ProductPriceService],
  exports: [ProductPriceService],
})
export class ProductPriceModule {}
