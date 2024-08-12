import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RoomChatService } from './room-chat.service';
import { CreateRoomChatDto } from './dto/create-room-chat.dto';
import { UpdateRoomChatDto } from './dto/update-room-chat.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Chat room')
@Controller('room-chat')
export class RoomChatController {
  constructor(private readonly roomChatService: RoomChatService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() create: CreateRoomChatDto, @Request() req) {
    return this.roomChatService.create(create, req.user);
  }

  @UseGuards(AuthGuard)
  @Get('detail/:id')
  findOne(
    @Param('id') id: string,
    @Query('skip') skip: number,
    @Query('limit') limit: number,
    @Request() req,
  ) {
    return this.roomChatService.findOne(id, req.user, skip, limit);
  }

  @UseGuards(AuthGuard)
  @Get('customer')
  findByIdCustomer(@Request() req) {
    return this.roomChatService.findByIdCustomer(req.user);
  }

  @UseGuards(AuthGuard)
  @Get('shop')
  findByIdShop(@Request() req) {
    return this.roomChatService.findByIdShop(req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomChatDto: UpdateRoomChatDto,
  ) {
    return this.roomChatService.update(id, updateRoomChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomChatService.remove(id);
  }
}
