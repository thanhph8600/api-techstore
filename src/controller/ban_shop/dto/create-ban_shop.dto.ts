import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateBanShopDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty()
  id_shop: Types.ObjectId;

  @ApiProperty()
  banStartDate?: Date;

  @ApiProperty()
  banEndDate?: Date;

  @ApiProperty()
  numberOfBan?: number;

  @ApiProperty()
  reasonBan?: string;
}
