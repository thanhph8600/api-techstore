import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AutoReplyService } from './auto-reply.service';
import { CreateAutoReplyDto } from './dto/create-auto-reply.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('auto-reply')
export class AutoReplyController {
  constructor(private readonly autoReplyService: AutoReplyService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createAutoReplyDto: CreateAutoReplyDto, @Request() req) {
    return this.autoReplyService.create(createAutoReplyDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Get('')
  findByShop(@Request() req) {
    return this.autoReplyService.findByShop(req.user);
  }
}
