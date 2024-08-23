import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WalletTransactionsService } from './wallet-transactions.service';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';

@Controller('wallet-transactions')
export class WalletTransactionsController {
  constructor(
    private readonly walletTransactionsService: WalletTransactionsService,
  ) {}

  @Post()
  create(@Body() createWalletTransactionDto: CreateWalletTransactionDto) {
    return this.walletTransactionsService.create(createWalletTransactionDto);
  }

  @Get('wallet/:id')
  fintByIdWallet(@Param('id') id: string) {
    return this.walletTransactionsService.fintByIdWallet(id);
  }

  @Get()
  findAll() {
    return this.walletTransactionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletTransactionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWalletTransactionDto: UpdateWalletTransactionDto,
  ) {
    return this.walletTransactionsService.update(
      +id,
      updateWalletTransactionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletTransactionsService.remove(+id);
  }
}
