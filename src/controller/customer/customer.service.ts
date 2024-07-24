import { CartService } from './../cart/cart.service';
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

@Injectable()
export class CustomerService {
  constructor(
    private readonly cartService: CartService,
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
      await this.addUser(createCustomerDto);
      const newUserCreated = await this.customerModel.findOne({
        phone: createCustomerDto.phone,
      })
      // console.log('newUserCreated', newUserCreated);
      const newUserCart = {
        customerId: newUserCreated._id,
        cartItems: [],
      }
      this.cartService.create(newUserCart);
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

  findOneWithPhone(phone: string) {
    return this.customerModel.findOne({ phone: phone });
  }

  findOneWithEmail(email: string) {
    return this.customerModel.findOne({ email });
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
