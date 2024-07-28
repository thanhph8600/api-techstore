import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
export class CreateCustomerRewardDto {
    @ApiProperty()
    @IsNotEmpty()
    customerId: string;

    coin: number;

    voucher: string[];
}
