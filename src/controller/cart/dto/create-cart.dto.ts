import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CartItem {
  @ApiProperty()
  productPriceId: string;

  @ApiProperty()
  quantity: number;
}

export class CreateCartDto {
  @ApiProperty()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ type: [CartItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItem)
  cartItems: CartItem[];
}
