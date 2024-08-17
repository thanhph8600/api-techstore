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
import { ItemsOrderService } from './items-order.service';
import { CreateItemsOrderDto } from './dto/create-items-order.dto';
import { UpdateItemsOrderDto } from './dto/update-items-order.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('items-order')
export class ItemsOrderController {
  constructor(private readonly itemsOrderService: ItemsOrderService) {}

  @Post()
  create(@Body() createItemsOrderDto: CreateItemsOrderDto) {
    return this.itemsOrderService.create(createItemsOrderDto);
  }

  @Get()
  findAll() {
    return this.itemsOrderService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.itemsOrderService.findById(id);
  }

  @Get('customer/:id')
  findByCustomerId(@Param('id') id: string) {
    return this.itemsOrderService.findByIdCustomer(id);
  }

  @UseGuards(AuthGuard)
  @Get('shop/:id')
  findByShop(@Request() req) {
    return this.itemsOrderService.findByShop(req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemsOrderDto: UpdateItemsOrderDto,
  ) {
    return this.itemsOrderService.update(+id, updateItemsOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsOrderService.remove(+id);
  }
}
