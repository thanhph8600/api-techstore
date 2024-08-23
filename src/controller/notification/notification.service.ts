import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationType } from './Schemas/notification.schema';
import { WebSocketGateway } from 'src/web-socket/web-socket.gateway';
import { payload } from '../customer/interface/customer.interface';
// import { Queue } from 'bull';
@Injectable()
export class NotificationService {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
    private readonly websocket: WebSocketGateway,
  ) {}
  async create(
    createNotification: CreateNotificationDto,
    delayInSeconds: number = 5,
  ): Promise<Notification> {
    const newNotification =
      await this.notificationModel.create(createNotification);
    const { customerId, title, content, type, orderItemsId } =
      createNotification;

    setTimeout(() => {
      this.websocket.server.emit('notification', {
        customerId,
        title,
        content,
        type,
        orderItemsId:
          type === NotificationType.ORDER ? orderItemsId : undefined,
      });
    }, delayInSeconds * 1000);
    return newNotification;
  }

  findAll() {
    return `This action returns all notification`;
  }

  async findByIdCustomer(id: string) {
    try {
      const notifications = await this.notificationModel
        .find({ customerId: id })
        .populate({
          path: 'orderItemsId',
          populate: {
            path: 'items.productPriceId',
            select: 'id_product',
            populate: [
              {
                path: 'id_product',
                select: 'name , thumbnails',
              },
            ],
          },
        })
        .exec();
      return notifications.reverse();
    } catch (error) {
      console.log(error);
    }
  }

  async findByShop(payload: payload) {
    try {
      const notifications = await this.notificationModel
        .find({ customerId: payload.sub })
        .populate({
          path: 'orderItemsId',
          populate: {
            path: 'items.productPriceId',
            select: 'id_product',
            populate: [
              {
                path: 'id_product',
                select: 'name , thumbnails',
              },
            ],
          },
        })
        .exec();
      return notifications.reverse();
    } catch (error) {
      console.log(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  async updateNotificationReaded(id: string) {
    await this.notificationModel.updateMany({ customerId: id }, { read: true });
  }
  update(id: number, updateNotificationDto: UpdateNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
