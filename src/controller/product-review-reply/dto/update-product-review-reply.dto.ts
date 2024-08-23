import { PartialType } from '@nestjs/swagger';
import { CreateProductReviewReplyDto } from './create-product-review-reply.dto';

export class UpdateProductReviewReplyDto extends PartialType(
  CreateProductReviewReplyDto,
) {}
