import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
  Get,
} from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateMessengerDto } from './dto/create-messenger.dto';

@ApiBearerAuth()
@ApiTags('messenger')
@Controller('messenger')
export class MessengerController {
  constructor(private readonly messengerService: MessengerService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(
    @Request() req,
    @Body()
    messenger: CreateMessengerDto,
  ) {
    return this.messengerService.create(messenger, req.user);
  }

  @Patch(':id')
  updateWatch(@Param('id') id: string) {
    return this.messengerService.updateIsWatch(id);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.messengerService.findById(id);
  }
}
