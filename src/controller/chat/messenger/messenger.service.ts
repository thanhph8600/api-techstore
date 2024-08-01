import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateMessengerDto } from './dto/update-messenger.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Messenger } from './schemas/messenger.chat.schema';
import { Model } from 'mongoose';
import { RoomChatService } from '../room-chat/room-chat.service';
import { WebSocketGateway } from 'src/web-socket/web-socket.gateway';
import { CreateMessengerDto } from './dto/create-messenger.dto';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { ShopService } from 'src/controller/seller/shop/shop.service';
import { ProductService } from 'src/controller/product/product.service';

@Injectable()
export class MessengerService {
  constructor(
    @InjectModel('Messenger') private readonly MessengerModel: Model<Messenger>,
    @Inject(forwardRef(() => RoomChatService))
    private readonly roomChatService: RoomChatService,
    private readonly webSocket: WebSocketGateway,
    private readonly shopService: ShopService,
    private readonly productService: ProductService,
  ) {}
  async create(createMessengerDto: CreateMessengerDto, payload: payload) {
    try {
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
      }
      const newMess = await this.MessengerModel.create(createMessengerDto);
      await this.roomChatService.updateLastMess(roomChat._id, newMess._id);

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

  async findByIdRoomChat(idRoom: string) {
    try {
      const listMessenger = await this.MessengerModel.find({
        id_room_chat: idRoom,
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
