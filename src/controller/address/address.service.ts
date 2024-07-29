import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address } from './schemas/address.schemas';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto): Promise<HttpException> {
    try {
      const createdAddress = new this.addressModel(createAddressDto);
      await createdAddress.save();
      return new HttpException(
        'Địa chỉ đã được thêm thành công',
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Validation failed: ' + error.message);
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }

  async updateAddress(
    addressId: string,
    updateAddressDto: UpdateAddressDto,
  ): Promise<{ message: string }> {
    await this.addressModel
      .findByIdAndUpdate(addressId, updateAddressDto, { new: true })
      .exec();
    return { message: 'Địa chỉ của bạn đã được cập nhật thành công' };
  }

  async delete(addressId: string): Promise<{ message: string }> {
    const deletedAddress = await this.addressModel
      .findByIdAndDelete(addressId)
      .exec();
    if (!deletedAddress) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Address with ID ${addressId} not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }
    return { message: 'Địa chỉ của bạn đã được xóa thành công' };
  }

  async setDefaultAddress(
    addressId: string,
    customerId: string,
  ): Promise<string> {
    const session = await this.addressModel.db.startSession();
    session.startTransaction();

    try {
      await this.addressModel.updateMany(
        { customerId, isDefault: true },
        { isDefault: false },
        { session },
      );

      const updateDefaultAddress = await this.addressModel
        .findByIdAndUpdate(
          addressId,
          { isDefault: true },
          { new: true, session },
        )
        .exec();

      if (!updateDefaultAddress) {
        throw new NotFoundException(`Địa chỉ với ${addressId} không tìm thấy`);
      }

      await session.commitTransaction();
      return 'Đặt địa chỉ thành mặc định thành công';
    } catch (error) {
      await session.abortTransaction();
      throw new HttpException(
        'Đặt địa chỉ thành mặc định thất bại',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }
  async findByAddressId(addressId: string): Promise<Address> {
    const address = await this.addressModel.findById(addressId).exec();
    if (!address) {
      throw new NotFoundException(`Address with ID ${addressId} not found`);
    }
    return address;
  }
  async findAll(): Promise<Address[]> {
    return this.addressModel.find().exec();
  }

  async findByCustomerId(customerId: string): Promise<Address[]> {
    return this.addressModel.find({ customerId }).exec();
  }

  async findAllByCustomerId(customerId: string): Promise<Address[]> {
    // return this.addressModel.find({ customerId }).exec();
    return this.addressModel
      .find({ customerId })
      .sort({ isDefault: -1 })
      .exec();
  }
}
