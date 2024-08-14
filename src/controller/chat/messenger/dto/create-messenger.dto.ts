import { ApiProperty } from '@nestjs/swagger';

export class CreateMessengerDto {
  id_roomChat: string;

  @ApiProperty()
  id_customer: string;

  id_sender: string;

  @ApiProperty()
  id_shop: string;

  @ApiProperty()
  id_product: string;

  @ApiProperty()
  senderType: string;

  @ApiProperty()
  thumbnail: string;

  @ApiProperty()
  video: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  isWatched: boolean;

  @ApiProperty()
  created_at: Date;
}
