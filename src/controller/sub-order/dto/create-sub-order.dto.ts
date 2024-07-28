import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class Item {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  productPriceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateSubOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  customerId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  shipping?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  voucherShop?: string;

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

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  costShipping?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  subTotal?: number;

  @ApiProperty({ required: false })
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

  @ApiProperty({ type: [Item] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  total?: number;
}
