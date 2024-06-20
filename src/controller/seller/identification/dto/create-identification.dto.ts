import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreateIdentificationDto {
  @ApiProperty()
  @IsNotEmpty()
  id_shop: ObjectId;

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
