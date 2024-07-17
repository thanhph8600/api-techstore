import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomerService } from 'src/controller/customer/customer.service';
import { LoginDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Customer } from 'src/controller/customer/schemas/customer.schema';
import { CreateCustomerDto } from 'src/controller/customer/dto/create-customer.dto';
import { RefreshTokenDto } from './dto/refres_token.dto';

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
  ) {}

  async signIn(loginDto: LoginDto) {
    try {
      const user = await this.customerService.findOneWithPhone(loginDto.phone);
      if (!user) {
        return new HttpException('Số điện thoại không tồn tại!', 404);
      }
      const isMatch = await bcrypt.compare(loginDto.password, user.password);
      if (!isMatch) {
        return new HttpException('Mật khẩu không đúng!', 401);
      }

      if (user.isBan) {
        return new HttpException('Tài khoản của bạn đã bị khóa!', 401);
      }

      const payload = this.payload(user);

      return this.generateToken(payload);
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }

  async refreshToken(refresh_token: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync(
        refresh_token.refreshToken,
        {
          secret: process.env.JWT_SECRET_REFRESH,
        },
      );
      if (!payload) {
        return new HttpException('Invalid refresh token!', 419);
      }
      const user = await this.customerService.findOneWithPhone(payload.phone);
      const newPayload = this.payload(user);
      // console.log('user', newPayload);
      return this.generateToken(newPayload);
    } catch (error) {
      console.log('error refresh token', error);
      throw new InternalServerErrorException();
    }
  }

  async generateToken(payload) {
    try {
      const access_token = await this.jwtService.signAsync(payload);
      const refresh_token = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET_REFRESH,
        expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
      });
      await this.customerService.updateRefreshToken(payload.sub, refresh_token);
      return { access_token, refresh_token };
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }

  payload(user: Customer) {
    const payload = {
      username: user.name,
      phone: user.phone,
      sub: user._id,
      role: user.role == 1 ? 'customer' : 'admin',
      avata: user.avata,
    };
    if (
      !payload.avata.startsWith('http://') &&
      !payload.avata.startsWith('https://')
    ) {
      payload.avata = `${process.env.URL_API}uploads/${payload.avata}`;
    }
    return payload;
  }

  async register(signUpDto: CreateCustomerDto) {
    try {
      return this.customerService.create(signUpDto);
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException();
    }
  }
}
