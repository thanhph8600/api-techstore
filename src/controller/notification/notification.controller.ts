import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @Get('customer/:id')
  getNotification(@Param('id') id: string) {
    return this.notificationService.findByIdCustomer(id);
  }

  @UseGuards(AuthGuard)
  @Get('shop/:id')
  getNotificationByShop(@Request() req) {
    return this.notificationService.findByShop(req.user);
  }

  @UseGuards(AuthGuard)
  @Patch('shop/read')
  updateReadShop(@Request() req) {
    return this.notificationService.updateNotificationReaded(req.user.sub);
  }

  @UseGuards(AuthGuard)
  @Patch('shop/read/:id')
  updateReadbyId(@Request() req, @Param('id') id: string) {
    return this.notificationService.updateById(id, req.user.sub);
  }

  @Patch('read/:id')
  read(@Param('id') id: string) {
    return this.notificationService.updateNotificationReaded(id);
  }
}
