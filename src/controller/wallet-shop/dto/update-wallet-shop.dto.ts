import { PartialType } from '@nestjs/swagger';
import { CreateWalletShopDto } from './create-wallet-shop.dto';

export class UpdateWalletShopDto extends PartialType(CreateWalletShopDto) {}
