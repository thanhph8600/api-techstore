import { PartialType } from '@nestjs/swagger';
import { CreateWalletTransactionDto } from './create-wallet-transaction.dto';

export class UpdateWalletTransactionDto extends PartialType(CreateWalletTransactionDto) {}
