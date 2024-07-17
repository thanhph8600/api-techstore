import { PartialType } from '@nestjs/swagger';
import { CreateProductPriceDto } from './create-product-price.dto';

export class UpdateProductPriceDto extends PartialType(CreateProductPriceDto) {}
