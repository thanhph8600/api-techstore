import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerFollowService } from './customer-follow.service';
import { CreateCustomerFollowDto } from './dto/create-customer-follow.dto';
import { UpdateCustomerFollowDto } from './dto/update-customer-follow.dto';

@Controller('customer-follow')
export class CustomerFollowController {
  constructor(private readonly customerFollowService: CustomerFollowService) {}

  @Post()
  create(@Body() createCustomerFollowDto: CreateCustomerFollowDto) {
    return this.customerFollowService.create(createCustomerFollowDto);
  }

  @Post('follow/:id')
  follow(@Param('id') id: string, @Body('customerId') customerId: string) {
    return this.customerFollowService.follow(id, customerId);
  }

  @Get()
  findAll() {
    return this.customerFollowService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerFollowService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerFollowDto: UpdateCustomerFollowDto,
  ) {
    return this.customerFollowService.update(+id, updateCustomerFollowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerFollowService.remove(id);
  }
}
