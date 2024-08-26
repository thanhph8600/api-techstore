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

  @Post('deliveryFailed/:id')
  deliveryFailed(@Param('id') id: string) {
    return this.itemsOrderService.deliveryFailed(id);
  }

  @Get()
  findAll() {
    return this.itemsOrderService.findAll();
  }

  @Get('query/:customerId/:query')
  findByQuery(@Param('customerId') customerId: string,@Param('query') query: string) {
    return this.itemsOrderService.findByQuery(customerId,query);
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

  @Post('cancel/:id')
  cancelOrder(@Param('id') id: string) {
    return this.itemsOrderService.cancelOrder(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateItemsOrderDto: UpdateItemsOrderDto,
  ) {
    return this.itemsOrderService.update(id, updateItemsOrderDto);
  }

  @Patch('updateStatusTime/123')
  updateStatusTime(@Body() payload: {id: string, key: string, value: Date}) {
    return this.itemsOrderService.updateStatusTime(payload);
  }

  @UseGuards(AuthGuard)
  @Patch('update-status/:id')
  updateStatusOrder(
    @Param('id') id: string,
    @Request() req,
    @Body() data: { status: string },
  ) {
    return this.itemsOrderService.updateStatusOrder(id, req.user, data.status);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsOrderService.remove(+id);
  }
}
