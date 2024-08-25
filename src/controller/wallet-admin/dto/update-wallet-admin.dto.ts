import { PartialType } from '@nestjs/swagger';
import { CreateWalletAdminDto } from './create-wallet-admin.dto';

export class UpdateWalletAdminDto extends PartialType(CreateWalletAdminDto) {}
