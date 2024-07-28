import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CartSelectService } from './cart-select.service';
import { CreateCartSelectDto } from './dto/create-cart-select.dto';
import { UpdateCartSelectDto } from './dto/update-cart-select.dto';

@Controller('cart-select')
export class CartSelectController {
  constructor(private readonly cartSelectService: CartSelectService) {}

  @Post()
  create(@Body() createCartSelectDto: CreateCartSelectDto) {
    return this.cartSelectService.create(createCartSelectDto);
  }

  @Get()
  findAll() {
    return this.cartSelectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartSelectService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartSelectDto: UpdateCartSelectDto) {
    return this.cartSelectService.update(id, updateCartSelectDto);
  }

  @Patch('select-all/:id')
  selectAll(@Param('id') id: string, @Body() updateCartSelectDto: UpdateCartSelectDto) {
    return this.cartSelectService.selectAll(id, updateCartSelectDto);
  }
  @Patch('remove-child-item/:id')
  removeChildItem(@Param('id') id: string, @Body() updateCartSelectDto: UpdateCartSelectDto) {
    return this.cartSelectService.removeChildItem(id, updateCartSelectDto);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cartSelectService.remove(+id);
  }
}
