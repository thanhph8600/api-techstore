import { Controller, Post, Body } from '@nestjs/common';
import { WalletShopTransactionsService } from './wallet-shop-transactions.service';
import { CreateWalletShopTransactionDto } from './dto/create-wallet-shop-transaction.dto';

@Controller('wallet-shop-transactions')
export class WalletShopTransactionsController {
  constructor(
    private readonly walletShopTransactionsService: WalletShopTransactionsService,
  ) {}

  @Post()
  create(
    @Body() createWalletShopTransactionDto: CreateWalletShopTransactionDto,
  ) {
    return this.walletShopTransactionsService.create(
      createWalletShopTransactionDto,
    );
  }
}
