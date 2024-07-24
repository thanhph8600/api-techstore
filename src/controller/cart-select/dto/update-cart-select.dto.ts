import { PartialType } from '@nestjs/swagger';
import { CreateCartSelectDto } from './create-cart-select.dto';

export class UpdateCartSelectDto extends PartialType(CreateCartSelectDto) {}
