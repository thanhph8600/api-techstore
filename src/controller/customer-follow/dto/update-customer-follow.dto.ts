import { PartialType } from '@nestjs/swagger';
import { CreateCustomerFollowDto } from './create-customer-follow.dto';

export class UpdateCustomerFollowDto extends PartialType(
  CreateCustomerFollowDto,
) {}
