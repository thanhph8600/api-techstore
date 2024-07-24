import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateCustomerRewardDto {
    @ApiProperty()
    @IsNotEmpty()
    customer_id: string;

    coin: number;

    voucher: string[];
}
