import { PartialType } from '@nestjs/swagger';
import { CreateMessageShortCutDto } from './create-message-short-cut.dto';

export class UpdateMessageShortCutDto extends PartialType(
  CreateMessageShortCutDto,
) {}
