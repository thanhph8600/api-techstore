
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAdminVoucherDto } from './dto/create-admin-voucher.dto';
import { UpdateAdminVoucherDto } from './dto/update-admin-voucher.dto';
import {
  AdminVoucher,
  AdminVoucherSchemas,
} from './schemas/admin-voucher.schemas';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types, Connection } from 'mongoose';
import * as mongoose from 'mongoose';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { VoucherWalletService } from 'src/controller/voucher-wallet/voucher-wallet.service';

@Injectable()
export class AdminVoucherService {
  constructor(
    @InjectModel('AdminVoucher') private adminVoucherModal: Model<AdminVoucher>,
    private voucherWalletService: VoucherWalletService,
    @InjectConnection() private readonly connection: mongoose.Connection,
  ) {}

  async createAdminVoucher(
    createDto: CreateAdminVoucherDto,
    payload: payload,
  ): Promise<HttpException> {
    try {
      const checkCode = await this.adminVoucherModal.findOne({
        code: createDto.code,
      });
      if (checkCode) {
        return new HttpException(
          'Mã voucher này đã tồn tại !',
          HttpStatus.BAD_REQUEST,
        );
      }
      const createdAdminVoucher = new this.adminVoucherModal(createDto);
      await createdAdminVoucher.save();
      return new HttpException(
        'Voucher đã được tạo thành công',
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log('error create admin voucher: ', error);
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + error.message);
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async findAll() {
    return await this.adminVoucherModal
      .find()
      .sort({ time_created: -1 })
      .exec();
  }

  async findOneById(_id: string) {
    return await this.adminVoucherModal.find({ _id });
  }

  async findOneByCode(code: string, id_customer: Types.ObjectId) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      if (!code || typeof code !== 'string') {
        return new HttpException('Mã voucher không hợp lệ.', 400);
      }

      const voucher = await this.adminVoucherModal.findOne({ code });

      if (voucher.id_customer.includes(id_customer)) {
        return new HttpException('Người dùng đã nhận voucher này rồi', 400);
      }
      if (!voucher) {
        return new HttpException('Không tìm thấy voucher với mã này.', 404);
      } else if (voucher.id_customer.length >= voucher.maximum_total_usage) {
        return new HttpException(
          'Xin lỗi ! Số lượng voucher đã được nhận hết.',
          400,
        );
      }

      const id_customerToString = id_customer.toString();
      const idVoucherToObjectId = new Types.ObjectId(voucher._id);
      const userVoucherWallet =
        await this.voucherWalletService.findByIdCustomer(id_customerToString);

      voucher.id_customer.push(id_customer);
      await voucher.save({ session });

      userVoucherWallet.wallet_warehouse.push(idVoucherToObjectId);
      await userVoucherWallet.save({ session });

      await session.commitTransaction();
      return new HttpException(
        'Chúc mừng bạn đã nhận voucher thành công.',
        HttpStatus.OK,
      );
    } catch (error) {
      await session.abortTransaction();
      throw new Error(`Lỗi khi tìm voucher: ${error.message}`);
    } finally {
      await session.endSession();
    }
  }

  update(id: string, updateAdminVoucherDto: UpdateAdminVoucherDto) { return this.adminVoucherModal.updateOne({_id: id}, updateAdminVoucherDto) }

  async remove(id: string) {
    return await this.adminVoucherModal.deleteOne({ _id: id });
  }
}
