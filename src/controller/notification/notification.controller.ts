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
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
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
  @Get('customer/:id')
  getNotificationByShop(@Request() req) {
    return this.notificationService.findByShop(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @Patch('read/:id')
  read(@Param('id') id: string) {
    return this.notificationService.updateNotificationReaded(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
