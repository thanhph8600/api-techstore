import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VoucherWalletService } from './voucher-wallet.service';
import { CreateVoucherWalletDto } from './dto/create-voucher-wallet.dto';
import { UpdateVoucherWalletDto } from './dto/update-voucher-wallet.dto';
import { Public } from 'src/middleware/auth/public';

@Controller('voucher-wallet')
export class VoucherWalletController {
  constructor(private readonly voucherWalletService: VoucherWalletService) {}

  @Public()
  @Post()
  create(@Body() createVoucherWalletDto: CreateVoucherWalletDto) {
    return this.voucherWalletService.createVoucherWallet(createVoucherWalletDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.voucherWalletService.findAll();
  }

  @Public()
  @Get('findbyidcustomer/:id_customer')
  findByIdCustomer(@Param('id_customer') id_customer: string) {
    return this.voucherWalletService.findByIdCustomer(id_customer);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVoucherWalletDto: UpdateVoucherWalletDto) {
    return this.voucherWalletService.update(+id, updateVoucherWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.voucherWalletService.remove(+id);
  }
}
