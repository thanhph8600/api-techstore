import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateAutoReplyDto {
  @ApiProperty()
  id_shop: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  status: boolean;
}
