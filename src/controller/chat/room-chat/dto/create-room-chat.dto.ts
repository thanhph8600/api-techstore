import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomChatDto {
  @ApiProperty()
  id_customer: string;

  @ApiProperty()
  id_shop: string;

  @ApiProperty()
  theLastMess: string;
}
