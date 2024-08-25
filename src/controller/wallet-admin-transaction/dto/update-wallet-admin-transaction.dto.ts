import { PartialType } from '@nestjs/swagger';
import { CreateWalletAdminTransactionDto } from './create-wallet-admin-transaction.dto';

export class UpdateWalletAdminTransactionDto extends PartialType(CreateWalletAdminTransactionDto) {}
