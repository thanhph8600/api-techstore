import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "../Schemas/notification.schema";
import { IsNotEmpty } from "class-validator";

export class CreateNotificationDto {
    @ApiProperty()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty()
    @IsNotEmpty()
    title: string;

    @ApiProperty()
    @IsNotEmpty()
    content: string;

    @ApiProperty()
    @IsNotEmpty()
    type: NotificationType;

    @ApiProperty()
    orderItemsId?: string;
    
}
