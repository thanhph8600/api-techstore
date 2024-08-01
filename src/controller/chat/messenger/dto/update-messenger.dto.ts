import { PartialType } from '@nestjs/swagger';
import { CreateMessengerDto } from './create-messenger.dto';

export class UpdateMessengerDto extends PartialType(CreateMessengerDto) {}
