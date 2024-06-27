import { PartialType } from '@nestjs/swagger';
import { CreateSpectificationDetailDto } from './create-spectification-detail.dto';

export class UpdateSpectificationDetailDto extends PartialType(
  CreateSpectificationDetailDto,
) {}
