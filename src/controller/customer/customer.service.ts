import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer } from './schemas/customer.schema';
import * as bcrypt from 'bcrypt';
import { payload } from './interface/customer.interface';
import { UpdatePassword } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel('Customer') private readonly customerModel: Model<Customer>,
  ) {}
  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const user = await this.customerModel.findOne({
        phone: createCustomerDto.phone,
      });
      if (user) {
        return new HttpException(
          'Số điện thoại đã được dùng!',
          HttpStatus.CONFLICT,
        );
      }

      if (createCustomerDto.password.length < 6) {
        return new HttpException(
          'Mật khẩu phải có ít nhất 6 ký tự!',
          HttpStatus.BAD_REQUEST,
        );
      }
      this.addUser(createCustomerDto);
      return new HttpException('Đăng ký thành công!', HttpStatus.OK);
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }

  async addUser(createCustomerDto: CreateCustomerDto) {
    createCustomerDto.password = await this.hasdPass(
      createCustomerDto.password,
    );
    const newUser = await this.customerModel.create(createCustomerDto);
    return newUser;
  }

  findAll() {
    return `This action returns all customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  async findById(id: string) {
    return await this.customerModel.findById(id);
  }

  findOneWithPhone(phone: string) {
    return this.customerModel.findOne({ phone: phone });
  }

  findOneWithEmail(email: string) {
    return this.customerModel.findOne({ email });
  }

  async changePass(payload: payload, updatePassword: UpdatePassword) {
    try {
      if (updatePassword.new_password.length < 6) {
        return new HttpException(
          'Mật khẩu phải có ít nhất 6 ký tự!',
          HttpStatus.BAD_REQUEST,
        );
      }
      const customer = await this.findById(payload.sub);
      const isOldPasswordCorrect = await this.comparePass(
        updatePassword.old_password,
        customer.password,
      );

      if (!isOldPasswordCorrect) {
        return new HttpException(
          'Mật khẩu cũ không đúng!',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedNewPassword = await this.hasdPass(
        updatePassword.new_password,
      );
      customer.password = hashedNewPassword;
      await customer.save();

      return { message: 'Mật khẩu đã được thay đổi thành công!' };
    } catch (error) {
      console.log('error change pass customer', error);
      throw new InternalServerErrorException();
    }
  }

  updateRefreshToken(id: string, refreshToken: string) {
    return this.customerModel.findByIdAndUpdate(
      { _id: id },
      { refresh_token: refreshToken },
    );
  }

  async hasdPass(pass: string) {
    const saltOrRounds = 10;
    return await bcrypt.hash(pass, saltOrRounds);
  }
  async comparePass(pass: string, hash: string) {
    return await bcrypt.compare(pass, hash);
  }
}
