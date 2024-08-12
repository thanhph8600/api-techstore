import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsSubOrderService } from './items-sub-order.service';
import { CreateItemsSubOrderDto } from './dto/create-items-sub-order.dto';
import { UpdateItemsSubOrderDto } from './dto/update-items-sub-order.dto';

@Controller('items-sub-order')
export class ItemsSubOrderController {
  constructor(private readonly itemsSubOrderService: ItemsSubOrderService) {}

  @Post()
  create(@Body() createItemsSubOrderDto: CreateItemsSubOrderDto) {
    return this.itemsSubOrderService.create(createItemsSubOrderDto);
  }

  @Get()
  findAll() {
    return this.itemsSubOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsSubOrderService.findByIdSubOrder(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemsSubOrderDto: UpdateItemsSubOrderDto) {
    return this.itemsSubOrderService.update(id, updateItemsSubOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsSubOrderService.remove(+id);
  }
}
