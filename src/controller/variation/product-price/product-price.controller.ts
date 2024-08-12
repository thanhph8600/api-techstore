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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('product-price')
@Controller('product-price')
export class ProductPriceController {
  constructor(private readonly productPriceService: ProductPriceService) {}

  @Post()
  create(@Body() createDto: CreateProductPriceDto) {
    console.log(createDto);
    return this.productPriceService.createProductPrice(
      createDto.id_product,
      createDto.productPrice,
    );
  }

  @Post('variation')
  createVariation(@Body() createDto: CreateProductPriceDto) {
    return this.productPriceService.createVariation(
      createDto.id_product,
      createDto.variation,
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
  updateVarition(
    @Param('id') id: string,
    @Body() updateProductPriceDto: UpdateProductPriceDto,
  ) {
    return this.productPriceService.updateVation(id, updateProductPriceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productPriceService.remove(+id);
  }
}
