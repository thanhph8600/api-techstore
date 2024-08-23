import { PartialType } from '@nestjs/swagger';
import { CreateViolateDto } from './create-violate.dto';

export class UpdateViolateDto extends PartialType(CreateViolateDto) {}
