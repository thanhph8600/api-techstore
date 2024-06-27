import { PartialType } from '@nestjs/swagger';
import { CreateSpecificationDto } from './create-specification.dto';

export class UpdateSpecificationDto extends PartialType(
  CreateSpecificationDto,
) {}
