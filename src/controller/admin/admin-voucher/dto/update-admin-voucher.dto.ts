import { PartialType } from '@nestjs/swagger';
import { CreateAdminVoucherDto } from './create-admin-voucher.dto';

export class UpdateAdminVoucherDto extends PartialType(CreateAdminVoucherDto) {}
