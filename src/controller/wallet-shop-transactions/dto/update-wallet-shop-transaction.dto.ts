import { PartialType } from '@nestjs/swagger';
import { CreateWalletShopTransactionDto } from './create-wallet-shop-transaction.dto';

export class UpdateWalletShopTransactionDto extends PartialType(
  CreateWalletShopTransactionDto,
) {}
