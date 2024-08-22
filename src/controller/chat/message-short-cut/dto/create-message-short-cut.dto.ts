import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMessageShortCutDto {
  @ApiProperty()
  id_shop: string;

  @ApiProperty()
  @IsNotEmpty()
  contents: string[];

  @ApiProperty()
  @IsNotEmpty()
  group_name: string;

  @ApiProperty()
  @IsNotEmpty()
  status: boolean;
}
