import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateWalletAdminDto {
    @ApiProperty()
    @IsNotEmpty()
    id_customer: string


}
