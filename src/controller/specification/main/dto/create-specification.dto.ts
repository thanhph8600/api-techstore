import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateSpecificationDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
