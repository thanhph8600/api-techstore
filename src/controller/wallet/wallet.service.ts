import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet } from './schemas/wallet.schema';
import { WalletTransactionsService } from '../wallet-transactions/wallet-transactions.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/Schemas/notification.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel('Wallet') private readonly walletModel: Model<Wallet>,
    private readonly walletTransactionsService: WalletTransactionsService,
    private readonly notificationService: NotificationService
  ) {}
  create(createWalletDto: CreateWalletDto) {
    return this.walletModel.create(createWalletDto);
  }

  findAll() {
    return `This action returns all wallet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallet`;
  }

  async findByIdCustomer (id: string) {
    try {
      const wallet = await this.walletModel
        .findOne({ customerId: id })
        .populate({
          path: 'customerId',
          select: 'name phone avata',
        })
        .exec();
        if(!wallet){
         await this.create({customerId: id})
          return this.findByIdCustomer(id)
        }
      return wallet;
    } catch (error) {
      
    }
  }
  async update(id: string, updateWalletDto: UpdateWalletDto) {
    try {
      const wallet = await this.walletModel
        .findByIdAndUpdate(id, updateWalletDto, { new: true })
        .exec();
      return wallet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async withDraw(id: string, amount: number , description: string) {
    try {
      const wallet = await this.walletModel.findOne({ customerId: id }).exec();
      if (!wallet) {
        throw new InternalServerErrorException('Not found wallet');
      }
      const newAmount = wallet.balance - amount;
      if (newAmount < 0) {
        throw new InternalServerErrorException('Not enough money');
      }
      wallet.balance = newAmount;
      await wallet.save();
      const walletTransactions = await this.walletTransactionsService.create({
        walletId: wallet._id.toString(),
        amount: amount,
        type: 'withdraw',
        description: description
      });
      await this.notificationService.create({
        customerId: wallet.customerId.toString(),
        title: 'Biến động số dư',
        content: `-${fortmatNumberToVnd(amount)} cho ` + description + ` số dư sau giao dịch: ${fortmatNumberToVnd(newAmount)}`,
        type: NotificationType.WALLET,
      })
      return { walletTransactions };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
    
  }
  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }
}

export function fortmatNumberToVnd(amount: number) {
  return amount.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
}
