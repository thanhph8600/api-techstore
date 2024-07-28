import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerRewardService } from './customer-reward.service';
import { CreateCustomerRewardDto } from './dto/create-customer-reward.dto';
import { UpdateCustomerRewardDto } from './dto/update-customer-reward.dto';

@Controller('customer-reward')
export class CustomerRewardController {
  constructor(private readonly customerRewardService: CustomerRewardService) {}

  @Post()
  create(@Body() createCustomerRewardDto: CreateCustomerRewardDto) {
    return this.customerRewardService.create(createCustomerRewardDto);
  }

  @Get()
  findAll() {
    return this.customerRewardService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerRewardService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerRewardDto: UpdateCustomerRewardDto) {
    return this.customerRewardService.update(+id, updateCustomerRewardDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerRewardService.remove(+id);
  }
}
