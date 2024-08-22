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
} from '@nestjs/common';
import { MessageShortCutService } from './message-short-cut.service';
import { CreateMessageShortCutDto } from './dto/create-message-short-cut.dto';
import { UpdateMessageShortCutDto } from './dto/update-message-short-cut.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('message-short-cut')
export class MessageShortCutController {
  constructor(
    private readonly messageShortCutService: MessageShortCutService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() create: CreateMessageShortCutDto, @Request() req) {
    return this.messageShortCutService.create(create, req.user);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAllByShop(@Request() req) {
    return this.messageShortCutService.findByShop(req.user);
  }

  @Get('admin/sample')
  findSample() {
    return this.messageShortCutService.findMessShortCutSample();
  }

  @Get(':id')
  findbyID(@Param('id') id: string) {
    return this.messageShortCutService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() update: UpdateMessageShortCutDto,
    @Request() req,
  ) {
    return this.messageShortCutService.update(id, update, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.messageShortCutService.remove(id, req.user);
  }
}
