import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminVoucherDto } from './dto/create-admin-voucher.dto';
import { UpdateAdminVoucherDto } from './dto/update-admin-voucher.dto';
import { AdminVoucher } from './schemas/admin-voucher.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { payload } from 'src/controller/customer/interface/customer.interface';


@Injectable()
export class AdminVoucherService {
  constructor(@InjectModel('AdminVoucher') private adminVoucherModal: Model<AdminVoucher>) {}

  async createAdminVoucher(createDto: CreateAdminVoucherDto, payload:payload){
    try {
      const checkCode = await this.adminVoucherModal.findOne({code: createDto})
      if(checkCode) {
        return new HttpException('Mã voucher này đã tồn tại !', HttpStatus.BAD_REQUEST);
      }
      const createdAdminVoucher = await this.adminVoucherModal.create(createDto)
      return createdAdminVoucher
    }catch(error) {
      console.log("error create admin voucher");
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all adminVoucher`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminVoucher`;
  }

  update(id: number, updateAdminVoucherDto: UpdateAdminVoucherDto) {
    return `This action updates a #${id} adminVoucher`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminVoucher`;
  }
}
