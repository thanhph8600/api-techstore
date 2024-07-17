import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateProductSpecificationDto {
  @ApiProperty()
  @IsNotEmpty()
  id_product: string;

  @ApiProperty()
  @IsNotEmpty()
  id_specifications: string;

  @ApiProperty()
  @IsNotEmpty()
  id_specifications_detail: string;
}
