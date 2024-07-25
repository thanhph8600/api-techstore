import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Delete,
  Patch,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { Address } from './schemas/address.schemas';
import { Public } from 'src/middleware/auth/public';

@Controller('address')
@ApiTags('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<HttpException> {
    // try {
    //   const address = await this.addressService.create(createAddressDto);
    //   return address;
    // } catch (error) {
    //   throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    // }
    return this.addressService.create(createAddressDto);
  }

  @Public()
  @Patch('default')
  async setDefaultAddress(
    @Body() body: { addressId: string; customerId: string },
  ): Promise<{ message: string }> {
    const { addressId, customerId } = body;
    try {
      const message = await this.addressService.setDefaultAddress(
        addressId,
        customerId,
      );
      return { message };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Đặt địa chỉ thành mặc định thất bại',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Public()
  @Delete(':addressId')
  async delete(
    @Param('addressId') addressId: string,
  ): Promise<{ message: string }> {
    return this.addressService.delete(addressId);
  }
  @Get()
  async findAll() {
    return this.addressService.findAll();
  }

  @Get(':customerId')
  async findByCustomerId(@Param('customerId') customerId: string) {
    return this.addressService.findByCustomerId(customerId);
  }

  @Public()
  @Get('customer/:customerId')
  async findAllByCustomerId(
    @Param('customerId') customerId: string,
  ): Promise<Address[]> {
    return this.addressService.findAllByCustomerId(customerId);
  }
}
