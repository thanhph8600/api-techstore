import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { AdminVoucherService } from './admin-voucher.service';
import { CreateAdminVoucherDto } from './dto/create-admin-voucher.dto';
import { UpdateAdminVoucherDto } from './dto/update-admin-voucher.dto';

@Controller('admin-voucher')
export class AdminVoucherController {
  constructor(private readonly adminVoucherService: AdminVoucherService) {}

  @Post()
  create(@Body() createDto: CreateAdminVoucherDto, @Request() req) {
    return this.adminVoucherService.createAdminVoucher(createDto, req.user);
  }

  @Get()
  findAll() {
    return this.adminVoucherService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminVoucherService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminVoucherDto: UpdateAdminVoucherDto) {
    return this.adminVoucherService.update(+id, updateAdminVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminVoucherService.remove(+id);
  }
}
