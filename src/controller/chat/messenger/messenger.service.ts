import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateMessengerDto } from './dto/update-messenger.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Messenger, MessengerDocument } from './schemas/messenger.chat.schema';
import { Model } from 'mongoose';
import { RoomChatService } from '../room-chat/room-chat.service';
import { WebSocketGateway } from 'src/web-socket/web-socket.gateway';
import { CreateMessengerDto } from './dto/create-messenger.dto';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { ShopService } from 'src/controller/seller/shop/shop.service';
import { AutoReplyService } from 'src/controller/chat/auto-reply/auto-reply.service';

@Injectable()
export class MessengerService {
  constructor(
    @InjectModel('Messenger') private readonly MessengerModel: Model<Messenger>,
    @Inject(forwardRef(() => RoomChatService))
    private readonly roomChatService: RoomChatService,
    private readonly webSocket: WebSocketGateway,
    private readonly shopService: ShopService,
    private readonly autoReplyService: AutoReplyService,
  ) {}
  async create(createMessengerDto: CreateMessengerDto, payload: payload) {
    try {
      let checkIsCustomer = true;
      const roomChat = await this.roomChatService.create(
        createMessengerDto,
        payload,
      );

      createMessengerDto.id_roomChat = roomChat._id;
      createMessengerDto.id_sender = payload.sub;
      createMessengerDto.senderType = 'Customer';

      if (createMessengerDto.id_customer) {
        const shop = await this.shopService.create(payload);
        createMessengerDto.id_sender = shop._id;
        createMessengerDto.senderType = 'Shop';
        checkIsCustomer = false;
      }

      const newMess = await this.MessengerModel.create(createMessengerDto);
      await this.roomChatService.updateLastMess(roomChat._id, newMess._id);

      if (checkIsCustomer)
        await this.sendMessAuto(
          roomChat._id,
          createMessengerDto.id_shop,
          newMess,
        );

      const payloadSocket = {
        id_customer: createMessengerDto.id_customer,
        id_shop: createMessengerDto.id_shop,
        id_sender: payload.sub,
        id_roomChat: roomChat._id,
      };
      await this.webSocket.sendMess(payloadSocket);
      return newMess;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async NewMessage(payload: any, req: any) {
    payload.senderType = 'Customer';
    payload.id_sender = payload.id_customer;
    try {
      if (payload.id_room) {
        payload.id_roomChat = payload.id_room;
        const newMess = await this.MessengerModel.create(payload);
        await this.roomChatService.updateLastMess(payload.id_room, newMess._id);
        const payloadSocket = {
          id_customer: payload.id_customer,
          id_shop: payload.id_shop,
          id_sender: payload.sub,
          id_roomChat: payload.id_room,
        };
        await this.webSocket.sendMess(payloadSocket);
        return newMess;
      } else {
        const newRoom = await this.roomChatService.createRoomChat(payload);
        payload.id_roomChat = newRoom._id;
        const newMess = await this.MessengerModel.create(payload);
        await this.roomChatService.updateLastMess(newRoom._id, newMess._id);
        const payloadSocket = {
          id_customer: payload.id_customer,
          id_shop: payload.id_shop,
          id_sender: payload.sub,
          id_roomChat: newRoom._id,
        }
        await this.webSocket.sendMess(payloadSocket);
        return newMess;
      }
    }
    catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }

  }
  async sendMessAuto(
    idRoom: string,
    id_shop: string,
    newMess: MessengerDocument,
  ) {
    const autoReply = await this.autoReplyService.findByIdShop(id_shop);
    if (!autoReply || !autoReply.status) return;
    const listMessenger = await this.findByIdRoomChat(idRoom);
    const checkMessAuto = listMessenger.filter(
      (item) => item.senderType === 'Shop' && item.isAuto,
    );
    if (checkMessAuto.length > 0) {
      const date = checkMessAuto[checkMessAuto.length - 1].created_at;
      const checkDate = this.compareTimeWith24Hours(date);
      if (!checkDate) {
        return;
      }
    }
    const dataMessAuto = {
      id_roomChat: String(newMess.id_roomChat),
      id_sender: String(id_shop),
      senderType: 'Shop',
      content: autoReply.content,
      isAuto: true,
    };
    const newMessage = await this.MessengerModel.create(dataMessAuto);
    await this.roomChatService.updateLastMess(
      String(newMessage.id_roomChat),
      newMessage._id,
    );
  }

  compareTimeWith24Hours(existingTime: string | Date): boolean {
    const currentTime = new Date();
    const existingDate = new Date(existingTime);
    const diffInMilliseconds = currentTime.getTime() - existingDate.getTime();
    const diffInHours = diffInMilliseconds / (1000 * 60 * 60);
    return diffInHours > 24;
  }

  async findByIdRoomChat(idRoom: string) {
    try {
      const listMessenger = await this.MessengerModel.find({
        id_roomChat: idRoom,
      });
      return listMessenger;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findTheLastMessByIdRoom(idRoom: string) {
    try {
      const listMessenger = await this.MessengerModel.findOne({
        id_room_chat: idRoom,
      })
        .sort({ created_at: -1 })
        .exec();
      return listMessenger;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  update(id: string, updateMessengerDto: UpdateMessengerDto) {
    try {
      return this.MessengerModel.findByIdAndUpdate(
        { _id: id },
        updateMessengerDto,
      );
    } catch (error) {
      console.log('Lỗi cập nhật messenger');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async updateIsWatch(id_roomChat: string) {
    try {
      await this.MessengerModel.updateMany(
        { id_roomChat },
        { $set: { isWatched: true } },
      );
      const room = await this.roomChatService.findById(id_roomChat);
      const payloadSocket = {
        id_customer: room.id_customer,
        id_shop: room.id_shop,
        id_roomChat,
      };
      await this.webSocket.sendMess(payloadSocket);
    } catch (error) {
      console.log('Lỗi updateIsWatch messenger');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
  async findById(_id: string) {
    const mess = await this.MessengerModel.findById(_id)
      .populate({
        path: 'id_product',
        select: ['_id', 'id_shop', 'name', 'thumbnails'],
        populate: {
          path: 'product_price',
          select: ['stock', 'price'],
          populate: {
            path: 'discount_detail',
            select: ['percent', 'status'],
            populate: {
              path: 'id_discount',
            },
          },
        },
      })
      .lean()
      .exec();
    return handleProductPriceAndDiscount(mess);
  }

  async manageMessgase(payload: payload) {
    const manage = {
      countChat: 0,
      resRate: 0,
      aveTime: 0,
    };
    const listRoomMess = await this.roomChatService.findByIdShop(payload);
    const firstMess = listRoomMess.flatMap(
      (item) => item.messenger[item.messenger.length - 1],
    );
    const itemMessCustomer = firstMess.filter(
      (item) => item.senderType == 'Customer',
    );

    if (itemMessCustomer.length > 0) {
      manage.countChat = itemMessCustomer.length;
      manage.resRate = 100;
      for (const element of itemMessCustomer) {
        const listMess = await this.MessengerModel.find({
          id_roomChat: element.id_roomChat,
        });

        const customerMessages = listMess.filter(
          (msg) => msg.senderType === 'Customer',
        );
        const shopMessages = listMess.filter(
          (msg) => msg.senderType === 'Shop',
        );

        if (shopMessages.length == 0) {
          manage.resRate = manage.resRate - (1 / itemMessCustomer.length) * 100;
        } else {
          let totalResponseTime = 0;
          let responseCount = 0;

          let i = 0; // Index cho tin nhắn của người dùng
          let j = 0; // Index cho tin nhắn của shop

          while (i < customerMessages.length) {
            const customerMessage = customerMessages[i];

            // Tìm tin nhắn của shop đầu tiên đến sau tin nhắn của khách hàng
            while (
              j < shopMessages.length &&
              new Date(shopMessages[j].created_at).getTime() <=
                new Date(customerMessage.created_at).getTime()
            ) {
              j++;
            }

            // Nếu có tin nhắn của shop phản hồi
            if (j < shopMessages.length) {
              const shopReply = shopMessages[j];
              if (shopReply.created_at > customerMessage.created_at) {
                const responseTime =
                  new Date(shopReply.created_at).getTime() -
                  new Date(customerMessage.created_at).getTime();
                totalResponseTime += responseTime;
                responseCount++;
                j++; // Chuyển sang tin nhắn tiếp theo của shop
              }
            }
            i++; // Chuyển sang tin nhắn tiếp theo của khách hàng
          }
          // Tính thời gian trả lời trung bình
          const averageResponseTime =
            responseCount > 0 ? totalResponseTime / responseCount : 0;
          manage.aveTime = manage.aveTime + averageResponseTime;
        }
      }
      manage.aveTime = Math.floor(manage.aveTime / itemMessCustomer.length);
    }
    return manage;
  }
}
export function handleProductPriceAndDiscount(mess) {
  const currentTime = new Date();

  // Function to filter out invalid discounts
  const filterValidDiscounts = (discounts) => {
    return discounts.filter((discount) => {
      const { time_start, time_end } = discount.id_discount;
      const startTime = new Date(time_start);
      const endTime = new Date(time_end);
      return startTime <= currentTime && currentTime <= endTime;
    });
  };

  const productsWithValidDiscounts = mess.id_product.product_price.map(
    (priceItem) => {
      const validDiscounts = filterValidDiscounts(priceItem.discount_detail);

      return {
        ...priceItem,
        discount_detail:
          validDiscounts.length > 0
            ? validDiscounts.map((discount) => ({ percent: discount.percent }))
            : null,
      };
    },
  );

  return {
    ...mess,
    id_product: {
      ...mess.id_product,
      product_price: productsWithValidDiscounts,
    },
  };
}
