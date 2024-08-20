import { PartialType } from '@nestjs/swagger';
import { CreateAutoReplyDto } from './create-auto-reply.dto';

export class UpdateAutoReplyDto extends PartialType(CreateAutoReplyDto) {}
