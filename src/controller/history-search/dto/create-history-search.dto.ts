import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsArray } from 'class-validator';

export class CreateHistorySearchDto {
    @ApiProperty()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({ type: [String] })
    @IsArray()
    query: string[]
}

