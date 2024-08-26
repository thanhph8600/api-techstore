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
  Put,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { ObjectId } from 'mongoose';
import { Public } from 'src/middleware/auth/public';

@ApiBearerAuth()
@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    return this.productService.create(createProductDto, req.user);
  }

  @Public()
  @Post('view/:id')
  createViewProduct(@Param('id') id: string) {
    return this.productService.createViewProduct(id);
  }

  @Public()
  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Public()
  @Get(':id')
  findById(@Param('id') id: ObjectId) {
    return this.productService.findOne(id);
  }

  @Public()
  @Get('shop/:idShop')
  findByIdShop(@Param('idShop') idShop: string) {
    return this.productService.findByIdShop(idShop);
  }

  @Get('query')
  async search(
    @Query('q') q: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('sort') sort?: string,
  ) {
    try {
      return await this.productService.productQuery(q, page, limit, sort);
    } catch (error) {
      console.error('Error in search:', error);
      throw new InternalServerErrorException(
        'An error occurred while processing the request.',
      );
    }
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Patch('updateThumbnails/:id')
  updateThumbnails(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.updateThumbnail(id, updateProductDto);
  }

  @UseGuards(AuthGuard)
  @Patch('banned/:id')
  banned(@Param('id') id: string, @Request() req, @Body() banned) {
    return this.productService.updateBanned(id, req.user, banned);
  }

  @UseGuards(AuthGuard)
  @Patch('unlisted/:id')
  unlisted(@Param('id') id: string, @Request() req, @Body() unlisted) {
    return this.productService.updateUnlisted(id, req.user, unlisted);
  }

  @Put('specification')
  updateSpecification(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProductSpecification(updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
