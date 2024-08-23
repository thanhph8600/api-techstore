import { PartialType } from '@nestjs/swagger';
import { CreateAddressShopDto } from './create-address-shop.dto';

export class UpdateAddressShopDto extends PartialType(CreateAddressShopDto) {}
