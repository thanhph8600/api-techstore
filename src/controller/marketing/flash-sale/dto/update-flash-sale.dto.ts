import { PartialType } from '@nestjs/swagger';
import {
  CreateFlashSaleDetailDto,
  CreateFlashSaleDto,
} from './create-flash-sale.dto';

export class UpdateFlashSaleDto extends PartialType(CreateFlashSaleDto) {}
export class UpdateFlashSaleDetailDto extends PartialType(
  CreateFlashSaleDetailDto,
) {}
