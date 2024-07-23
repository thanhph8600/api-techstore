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
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './dto/create-voucher.dto';
import { UpdateVoucherDto } from './dto/update-voucher.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { Public } from 'src/middleware/auth/public';

@Controller('voucher')
export class VoucherController {
  constructor(private readonly voucherService: VoucherService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createVoucherDto: CreateVoucherDto, @Request() req) {
    return this.voucherService.create(createVoucherDto, req.user);
  }

  @Public()
  @Get()
  findAll() {
    return this.voucherService.findAll();
  }

  @Public()
  @Get(':id')
  findByIdVoucher(@Param('id') id: string) {
    return this.voucherService.findByIdVoucher(id);
  }

  @Public()
  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.voucherService.findByCode(code);
  }

  @Public()
  @Get('shop/:idShop')
  findByIdShop(@Param('idShop') idShop: string) {
    return this.voucherService.findByIdShop(idShop);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherDto: UpdateVoucherDto) {
    return this.voucherService.update(id, updateVoucherDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherService.remove(id);
  }
}
