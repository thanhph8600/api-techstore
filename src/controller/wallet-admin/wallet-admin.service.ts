import { Injectable } from '@nestjs/common';
import { CreateWalletAdminDto } from './dto/create-wallet-admin.dto';
import { UpdateWalletAdminDto } from './dto/update-wallet-admin.dto';

@Injectable()
export class WalletAdminService {
  create(createWalletAdminDto: CreateWalletAdminDto) {
    return 'This action adds a new walletAdmin';
  }

  findAll() {
    return `This action returns all walletAdmin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} walletAdmin`;
  }

  update(id: number, updateWalletAdminDto: UpdateWalletAdminDto) {
    return `This action updates a #${id} walletAdmin`;
  }

  remove(id: number) {
    return `This action removes a #${id} walletAdmin`;
  }
}
