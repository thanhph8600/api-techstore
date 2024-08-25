import { Injectable } from '@nestjs/common';
import { CreateWalletAdminTransactionDto } from './dto/create-wallet-admin-transaction.dto';
import { UpdateWalletAdminTransactionDto } from './dto/update-wallet-admin-transaction.dto';

@Injectable()
export class WalletAdminTransactionService {
  create(createWalletAdminTransactionDto: CreateWalletAdminTransactionDto) {
    return 'This action adds a new walletAdminTransaction';
  }

  findAll() {
    return `This action returns all walletAdminTransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletAdminTransaction`;
  }

  update(id: number, updateWalletAdminTransactionDto: UpdateWalletAdminTransactionDto) {
    return `This action updates a #${id} walletAdminTransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletAdminTransaction`;
  }
}
