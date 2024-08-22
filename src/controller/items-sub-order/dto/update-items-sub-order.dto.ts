import { PartialType } from '@nestjs/swagger';
import { CreateItemsSubOrderDto } from './create-items-sub-order.dto';

export class UpdateItemsSubOrderDto extends PartialType(
  CreateItemsSubOrderDto,
) {}
