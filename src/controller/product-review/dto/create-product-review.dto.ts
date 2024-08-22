import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreateProductReviewDto {
  _id: ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    productPriceId: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    productId: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    itemsOrderId: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    customerId: string;

    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Number)
    rating: number;

    @ApiProperty()
    @Type(() => String)
    content: string;

    images?: string[];
}
