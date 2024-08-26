import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { CreateProductReviewDto } from './dto/create-product-review.dto';
import { UpdateProductReviewDto } from './dto/update-product-review.dto';
import { Public } from 'src/middleware/auth/public';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('product-review')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}
  @Public()
  @Post()
  create(@Body() createProductReviewDto: CreateProductReviewDto) {
    return this.productReviewService.create(createProductReviewDto);
  }

  @Get()
  findAll() {
    return this.productReviewService.findAll();
  }

  @Public()
  @Get('product/:id')
  findAllByProduct(@Param('id') id: string) {
    return this.productReviewService.getReviewByIdProduct(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productReviewService.findOne(+id);
  }

  @Public()
  @Get('rating/shop/:id')
  getRatingByShop(@Param('id') id: string) {
    return this.productReviewService.getRateingByIdShop(id);
  }
  
  @UseGuards(AuthGuard)
  @Get('shop/:id')
  findByShop(@Request() req) {
    return this.productReviewService.findByShop(req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductReviewDto: UpdateProductReviewDto,
  ) {
    return this.productReviewService.update(+id, updateProductReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productReviewService.remove(+id);
  }
}
