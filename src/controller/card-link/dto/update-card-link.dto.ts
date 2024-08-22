import { PartialType } from '@nestjs/swagger';
import { CreateCardLinkDto } from './create-card-link.dto';

export class UpdateCardLinkDto extends PartialType(CreateCardLinkDto) {}
