import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsPhoneNumber, Length } from 'class-validator';
import { Types } from 'mongoose';
export class CreateAddressDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  customerId: Types.ObjectId;

  @IsNotEmpty()
  @ApiProperty()
  fullName: string;

  @IsNotEmpty()
  @Length(10, 10)
  @IsPhoneNumber('VN')
  @ApiProperty()
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @IsNotEmpty()
  ward: string;

  addressType: boolean;

  isDefault: boolean;
}
