import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
export class CreateProductPriceDto {
  @ApiProperty()
  id_product: ObjectId;

  @ApiProperty()
  id_size: ObjectId;

  @ApiProperty()
  id_color: ObjectId;

  @ApiProperty()
  price: number;

  @ApiProperty()
  stock: number;

  @ApiProperty()
  productPrice: {
    name_color: string;
    name_size: string;
    price: number;
    stock: number;
  }[];
}
