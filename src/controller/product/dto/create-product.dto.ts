import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreateProductDto {
  _id: ObjectId;

  @ApiProperty()
  id_shop: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  id_categoryDetail: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  thumbnails: string[];

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  view: number;

  @ApiProperty()
  banned: boolean;

  @ApiProperty()
  unlisted: boolean;

  @ApiProperty()
  specifications: {
    [key: string]: string;
  }[];

  @ApiProperty()
  variation: {
    [key: string]: {
      name: string;
    }[];
  };
}
