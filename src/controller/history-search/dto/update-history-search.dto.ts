import { PartialType } from '@nestjs/swagger';
import { CreateHistorySearchDto } from './create-history-search.dto';

export class UpdateHistorySearchDto extends PartialType(CreateHistorySearchDto) {}
