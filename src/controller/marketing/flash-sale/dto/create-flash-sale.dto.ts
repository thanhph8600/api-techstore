import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateFlashSaleDto {
  @ApiProperty()
  id_shop: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  time_start: Date;

  @ApiProperty()
  @IsNotEmpty()
  time_end: Date;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  view: number;

  @ApiProperty()
  number_reminders: number;
}

export class CreateFlashSaleDetailDto {
  @IsNotEmpty()
  @ApiProperty()
  id_flashSale: ObjectId;

  @IsNotEmpty()
  @ApiProperty()
  id_productPrice: ObjectId;

  @IsNotEmpty()
  @ApiProperty()
  percent: number;

  @IsNotEmpty()
  @ApiProperty()
  limit_product: number | 'Không giới hạn';

  @IsNotEmpty()
  @ApiProperty()
  limit_customer: number | 'Không giới hạn';

  @IsNotEmpty()
  @ApiProperty()
  status: boolean;
}
