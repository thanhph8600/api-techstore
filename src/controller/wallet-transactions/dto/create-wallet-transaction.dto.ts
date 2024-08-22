import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateWalletTransactionDto {

    @ApiProperty()
    @IsNotEmpty()
    walletId: string

    @ApiProperty()
    @IsNotEmpty()
    amount: number

    @ApiProperty()
    @IsNotEmpty()
    type: string

    cardId?: string

    @ApiProperty()
    @IsNotEmpty()
    description: string

}
