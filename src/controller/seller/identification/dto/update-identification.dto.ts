import { PartialType } from '@nestjs/swagger';
import { CreateIdentificationDto } from './create-identification.dto';

export class UpdateIdentificationDto extends PartialType(
  CreateIdentificationDto,
) {}
