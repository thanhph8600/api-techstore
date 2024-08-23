import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReturnOrderService } from './return-order.service';
import { CreateReturnOrderDto } from './dto/create-return-order.dto';
import { UpdateReturnOrderDto } from './dto/update-return-order.dto';

@Controller('return-order')
export class ReturnOrderController {
  constructor(private readonly returnOrderService: ReturnOrderService) {}

  @Post()
  create(@Body() createReturnOrderDto: CreateReturnOrderDto) {
    return this.returnOrderService.create(createReturnOrderDto);
  }

  @Get()
  findAll() {
    return this.returnOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.returnOrderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReturnOrderDto: UpdateReturnOrderDto) {
    return this.returnOrderService.update(+id, updateReturnOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.returnOrderService.remove(+id);
  }
}
