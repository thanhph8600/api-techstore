import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateShopDto {
  @ApiProperty()
  id_customer: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  count_follower: string;

  @ApiProperty()
  star: string;
}
