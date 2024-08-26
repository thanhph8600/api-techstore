import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAdminVoucherDto {
  @ApiProperty()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  time_start: Date;

  @ApiProperty()
  @IsNotEmpty()
  time_end: Date;

  @ApiProperty()
  @IsNotEmpty()
  percent: number;

  @ApiProperty()
  @IsNotEmpty()
  maximum_reduction: number;

  @ApiProperty()
  @IsNotEmpty()
  minimum_order_value: number;

  @ApiProperty()
  @IsNotEmpty()
  maximum_total_usage: number;

  @ApiProperty()
  is_public: boolean

  @ApiProperty()
  time_created: Date;
}
