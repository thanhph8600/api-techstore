import { PartialType } from '@nestjs/swagger';
import { CreateItemsOrderDto } from './create-items-order.dto';

export class UpdateItemsOrderDto extends PartialType(CreateItemsOrderDto) {}
