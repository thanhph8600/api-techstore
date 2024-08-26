import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAddressShopDto {
  @ApiProperty()
  id_shop: string;

  @ApiProperty()
  @IsNotEmpty()
  province: string;

  @ApiProperty()
  @IsNotEmpty()
  district: string;

  @ApiProperty()
  @IsNotEmpty()
  ward: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;
}
