import { PartialType } from '@nestjs/swagger';
import { CreateAnalysisShopDto } from './create-analysis-shop.dto';

export class UpdateAnalysisShopDto extends PartialType(CreateAnalysisShopDto) {}
