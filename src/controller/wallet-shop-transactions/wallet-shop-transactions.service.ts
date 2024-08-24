import { Injectable } from '@nestjs/common';
import { CreateWalletShopTransactionDto } from './dto/create-wallet-shop-transaction.dto';
import { Model } from 'mongoose';
import { WalletTransactions } from '../wallet-transactions/schemas/wallet-transactions.schema';
import { InjectModel } from '@nestjs/mongoose';
import { WalletShopTransactions } from './schemas/wallet-shop-transactions.schema';

@Injectable()
export class WalletShopTransactionsService {
  constructor(
    @InjectModel(WalletShopTransactions.name)
    private walletShopTransactionModel: Model<WalletTransactions>,
  ) {}
  create(create: CreateWalletShopTransactionDto) {
    return this.walletShopTransactionModel.create(create);
  }
}
