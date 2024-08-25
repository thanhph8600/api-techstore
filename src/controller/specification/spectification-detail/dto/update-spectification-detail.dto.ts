import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSpectificationDetailDto } from './create-spectification-detail.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSpectificationDetailDto extends PartialType(
  CreateSpectificationDetailDto,
) {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  _id: string;
}
