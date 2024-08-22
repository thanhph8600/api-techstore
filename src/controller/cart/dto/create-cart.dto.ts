import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
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

export class CreateCartDto {
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => String)
  customerId: string;

  @ApiProperty({
    type: [CartItemDto],
    description: 'Array of cart items grouped by shopId',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  cartItems: {
    shopId: string;
    items: CartItemDto[];
  }[];
}
