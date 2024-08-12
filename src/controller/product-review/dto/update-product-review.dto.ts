import { PartialType } from '@nestjs/swagger';
import { CreateProductReviewDto } from './create-product-review.dto';

export class UpdateProductReviewDto extends PartialType(CreateProductReviewDto) {}
