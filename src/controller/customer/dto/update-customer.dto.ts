import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
export class UpdatePassword {
  @ApiProperty()
  @IsNotEmpty()
  new_password: string;

  @ApiProperty()
  @IsNotEmpty()
  old_password: string;
}
