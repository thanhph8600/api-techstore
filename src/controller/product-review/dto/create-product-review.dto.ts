import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongoose';
export class CreateProductReviewDto {
    _id: ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    productId: ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    customerId: ObjectId;

    @ApiProperty()
    @IsNotEmpty()
    rating: number;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    image?: string;

    @ApiProperty()
    created: Date
}
