import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty } from "class-validator"

export class CreateCustomerFollowDto {
    @ApiProperty()
    @IsNotEmpty()
    customerId: string
    
    @ApiProperty()
    @IsNotEmpty()
    shopId: string
}
