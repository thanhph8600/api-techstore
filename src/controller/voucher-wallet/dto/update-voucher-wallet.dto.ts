import { PartialType } from '@nestjs/swagger';
import { CreateVoucherWalletDto } from './create-voucher-wallet.dto';

export class UpdateVoucherWalletDto extends PartialType(
  CreateVoucherWalletDto,
) {}
