import { IsNotEmpty, IsString, IsArray, IsOptional, IsMongoId, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

class ReturnItemDto {
    @IsNotEmpty()
    @IsMongoId()
    productPriceId: Types.ObjectId;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsMongoId()
    discountDetailId?: Types.ObjectId;

    @IsNotEmpty()
    @IsString()
    returnReason: string;

    @IsNotEmpty()
    @IsNumber()
    refundAmount: number;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsOptional()
    @IsNumber()
    discount2t?: number;
}

export class CreateReturnOrderDto {
    @IsNotEmpty()
    @IsMongoId()
    customerId: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    itemsOrderId: Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    shopId: Types.ObjectId;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ReturnItemDto)
    itemsReturn: ReturnItemDto[];

    @IsOptional()
    @IsNumber()
    voucher?: number;

    @IsOptional()
    @IsString()
    status?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    statusUpdate?: string[];
}
