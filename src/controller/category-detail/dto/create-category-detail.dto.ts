import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';

export class CreateCategoryDetailDto {
  @ApiProperty()
  @IsNotEmpty()
  id_category: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  thumbnail: string;

  @ApiProperty()
  @IsNotEmpty()
  slug: string;
}
