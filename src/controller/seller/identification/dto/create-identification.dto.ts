import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreateIdentificationDto {
  @ApiProperty()
  id_shop: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  type_card:
    | 'Căn Cước Công Dân (CCCD)'
    | 'Chứng Minh Nhân Dân (CMND)'
    | 'Passport';

  @ApiProperty()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  CCCD_number: string;

  @ApiProperty()
  @IsNotEmpty()
  CCCD_photo: string;
}
