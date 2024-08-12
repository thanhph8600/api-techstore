import { PartialType } from '@nestjs/swagger';
import { CreateBanShopDto } from './create-ban_shop.dto';
import { IsOptional } from 'class-validator';

export class UpdateBanShopDto extends PartialType(CreateBanShopDto) {
  @IsOptional()
  banStartDate: Date;

  @IsOptional()
  banEndDate: Date;

  @IsOptional()
  reasonBan: string;
}
