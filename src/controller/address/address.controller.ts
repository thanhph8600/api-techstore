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
  NotFoundException,
  Put,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { ApiTags } from '@nestjs/swagger';
import { Address } from './schemas/address.schemas';
import { Public } from 'src/middleware/auth/public';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('address')
@ApiTags('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createAddressDto: CreateAddressDto): Promise<HttpException> {
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
  async setDefaultAddress(@Body() body: { addressId: string; customerId: string }): Promise<{ message: string }> {
    const { addressId, customerId } = body;
    try {
      const message = await this.addressService.setDefaultAddress(addressId, customerId);
      return { message };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Đặt địa chỉ thành mặc định thất bại', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Public()
  @Put(':addressId')
  async updateAddress(
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const updatedAddress = await this.addressService.updateAddress(
      addressId,
      updateAddressDto,
    );
    if (!updatedAddress) {
      throw new NotFoundException(`Địa chỉ với ID ${addressId} không được tìm thấy`);
    }
    return {
      message: 'Cập nhật địa chỉ thành công',
      address: updatedAddress,
    };
  }

  @Public()
  @Delete(':addressId')
  async delete(
    @Param('addressId') addressId: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const updatedAddress = await this.addressService.updateAddress(addressId, updateAddressDto);
    if (!updatedAddress) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }
    return {
      message: 'Address updated successfully',
      address: updatedAddress,
    };
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
  @Get('byaddressid/:addressId')
  async findByAddressId(@Param('addressId') addressId: string) {
    return this.addressService.findByAddressId(addressId);
  }

  @Public()
  @Get('customer/:customerId')
  async findAllByCustomerId(@Param('customerId') customerId: string): Promise<Address[]> {
    return this.addressService.findAllByCustomerId(customerId);
  }



}
