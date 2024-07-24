import { PartialType } from '@nestjs/swagger';
import { CreateCustomerRewardDto } from './create-customer-reward.dto';

export class UpdateCustomerRewardDto extends PartialType(CreateCustomerRewardDto) {}
