import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId, Types } from 'mongoose';

export class CreateVoucherWalletDto {
  @ApiProperty()
  @IsNotEmpty()
  id_customer: string;
}
