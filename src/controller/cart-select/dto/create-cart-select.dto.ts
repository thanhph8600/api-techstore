import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class listProductSelect {
  @ApiProperty()
  productPriceId: string;
}

export class CreateCartSelectDto {
  @ApiProperty()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({ type: [listProductSelect] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => listProductSelect)
  listProductSelect: listProductSelect[];
}
