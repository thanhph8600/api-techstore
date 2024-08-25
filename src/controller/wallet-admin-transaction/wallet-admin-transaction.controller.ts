import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletAdminTransactionService } from './wallet-admin-transaction.service';
import { CreateWalletAdminTransactionDto } from './dto/create-wallet-admin-transaction.dto';
import { UpdateWalletAdminTransactionDto } from './dto/update-wallet-admin-transaction.dto';

@Controller('wallet-admin-transaction')
export class WalletAdminTransactionController {
  constructor(private readonly walletAdminTransactionService: WalletAdminTransactionService) {}

  @Post()
  create(@Body() createWalletAdminTransactionDto: CreateWalletAdminTransactionDto) {
    return this.walletAdminTransactionService.create(createWalletAdminTransactionDto);
  }

  @Get()
  findAll() {
    return this.walletAdminTransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletAdminTransactionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletAdminTransactionDto: UpdateWalletAdminTransactionDto) {
    return this.walletAdminTransactionService.update(+id, updateWalletAdminTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletAdminTransactionService.remove(+id);
  }
}
