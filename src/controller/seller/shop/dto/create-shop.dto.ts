import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateShopDto {
  @ApiProperty()
  @IsNotEmpty()
  id_customer: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  count_follower: string;

  @ApiProperty()
  @IsNotEmpty()
  star: string;
}
