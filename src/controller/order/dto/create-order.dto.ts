import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Item {
    @ApiProperty()
  @IsNotEmpty()
  productPriceId: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;
  }
export class CreateOrderDto {
  @ApiProperty({ type: [Item] })
  @IsNotEmpty()
  customerId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  Items: Item[];
}
