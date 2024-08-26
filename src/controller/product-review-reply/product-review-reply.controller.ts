import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductReviewReplyService } from './product-review-reply.service';
import { CreateProductReviewReplyDto } from './dto/create-product-review-reply.dto';
import { UpdateProductReviewReplyDto } from './dto/update-product-review-reply.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('product-review-reply')
export class ProductReviewReplyController {
  constructor(
    private readonly productReviewReplyService: ProductReviewReplyService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req, @Body() create: CreateProductReviewReplyDto) {
    return this.productReviewReplyService.create(req.user, create);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() update: UpdateProductReviewReplyDto,
  ) {
    return this.productReviewReplyService.update(id, update, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.productReviewReplyService.remove(id, req.user);
  }
}
