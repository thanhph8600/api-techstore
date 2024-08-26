import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateProductReviewReplyDto {
  @ApiProperty()
  @IsNotEmpty()
  id_productReview: string;

  @ApiProperty()
  id_shop: string;

  @ApiProperty()
  @IsNotEmpty()
  content: string;

  @ApiProperty()
  images: [string];

  @ApiProperty()
  created: Date;
}
