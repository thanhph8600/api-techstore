import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemsSubOrder {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  productPriceId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  discountDetailId?: string;
}

export class CreateItemsSubOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  customerId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  subOrderId: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  shopId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemsSubOrder)
  items: ItemsSubOrder[];
}
