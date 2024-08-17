import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateVoucherWalletDto } from './dto/create-voucher-wallet.dto';
import { UpdateVoucherWalletDto } from './dto/update-voucher-wallet.dto';
import { InjectModel } from '@nestjs/mongoose';
import { VoucherWallet } from './schemas/voucher-wallet.schemas';
import { Model, ObjectId , Types} from 'mongoose';

@Injectable()
export class VoucherWalletService {
  constructor(@InjectModel('VoucherWallet') private voucherWalletModal: Model<VoucherWallet>) {}

  async createVoucherWallet(createVoucherWalletDto: CreateVoucherWalletDto) {
    try{
      const voucherWallet = new this.voucherWalletModal(createVoucherWalletDto)
      await voucherWallet.save();
      return new HttpException('Ví được tạo thành công', HttpStatus.CREATED)
    }catch(error) {
      console.log('error voucher wallet create', error);
      throw new InternalServerErrorException();
    }

  }

  async findAll() {
    return await this.voucherWalletModal.find()
  }

  async findByIdCustomer(id_customer: string) {
    return await this.voucherWalletModal.findOne({id_customer})
  }

  update(id: number, updateVoucherWalletDto: UpdateVoucherWalletDto) {
    return `This action updates a #${id} voucherWallet`;
  }

  remove(id: number) {
    return `This action removes a #${id} voucherWallet`;
  }
}
