import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray, ValidateNested, IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';



export class ItemsOrder {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    productPriceId: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    discountDetailId?: string;
  }
export class CreateItemsOrderDto {
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    customerId: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    orderId: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => String)
    shopId: string;
  
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemsOrder)
    items: ItemsOrder[];

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    costShipping: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    total: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    subTotal: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    discount: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @IsNumber()
    coin: number;

    @ApiProperty({ required: true })
    @IsNotEmpty()
    @Type(() => String)
    voucherShopId: string;

    statusShipping?: string;

    statusUpdate?: { key: string; value: Date }[];

    DeliveryTime?: Date;

}
