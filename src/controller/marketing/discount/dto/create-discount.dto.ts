import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDiscountDto {
  @ApiProperty()
  id_shop: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  id_productPrice: Types.ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  rabais: number;

  @ApiProperty()
  @IsNotEmpty()
  limit_product: number | string;

  @ApiProperty()
  @IsNotEmpty()
  limit_customer: number | string;

  @ApiProperty()
  @IsNotEmpty()
  time_start: Date;

  @ApiProperty()
  @IsNotEmpty()
  time_end: Date;

  @ApiProperty()
  @IsNotEmpty()
  status: boolean;

  @ApiProperty()
  created: Date;
}
