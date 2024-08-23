import { Injectable } from '@nestjs/common';
import { CreateWalletTransactionDto } from './dto/create-wallet-transaction.dto';
import { UpdateWalletTransactionDto } from './dto/update-wallet-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WalletTransactions } from './schemas/wallet-transactions.schema';

@Injectable()
export class WalletTransactionsService {
  constructor(
    @InjectModel('WalletTransactions')
    private walletTransactionModel: Model<WalletTransactions>,
  ) {}
  create(createWalletTransactionDto: CreateWalletTransactionDto) {
    return this.walletTransactionModel.create(createWalletTransactionDto);
  }

  async fintByIdWallet(id: string) {
    const transactions = await this.walletTransactionModel
      .find({ walletId: id })
      .exec();
    return transactions.reverse();
  }
  findAll() {
    return `This action returns all walletTransactions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletTransaction`;
  }

  update(id: number, updateWalletTransactionDto: UpdateWalletTransactionDto) {
    return `This action updates a #${id} walletTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletTransaction`;
  }
}
