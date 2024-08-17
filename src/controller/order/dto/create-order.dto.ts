import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  totalDiscountShop?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  voucher2t?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  coin?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  coinRefunt?: number;

  @ApiProperty({ required: true })
  @IsOptional()
  @IsNumber()
  totalDisCount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  voucherShipping?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  methodPayment?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  subTotal?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  total?: number;

  items?: any;

  subOrderId: string;
}
