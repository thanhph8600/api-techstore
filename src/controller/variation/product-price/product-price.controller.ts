import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Post,
} from '@nestjs/common';
import { ProductPriceService } from './product-price.service';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';
import { CreateProductPriceDto } from './dto/create-product-price.dto';

@Controller('product-price')
export class ProductPriceController {
  constructor(private readonly productPriceService: ProductPriceService) {}

  @Post()
  create(@Body() createDto: CreateProductPriceDto) {
    return this.productPriceService.createProductPrice(
      createDto.id_product,
      createDto.productPrice,
    );
  }

  @Get()
  findAll() {
    return this.productPriceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productPriceService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductPriceDto: UpdateProductPriceDto,
  ) {
    return this.productPriceService.update(+id, updateProductPriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPriceService.remove(+id);
  }
}
