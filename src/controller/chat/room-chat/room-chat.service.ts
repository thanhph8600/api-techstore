import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateRoomChatDto } from './dto/create-room-chat.dto';
import { UpdateRoomChatDto } from './dto/update-room-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RoomChat } from './schemas/roomChat.chat.schema';
import { MessengerService } from '../messenger/messenger.service';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { ShopService } from 'src/controller/seller/shop/shop.service';
import { CreateMessengerDto } from '../messenger/dto/create-messenger.dto';

@Injectable()
export class RoomChatService {
  constructor(
    @InjectModel('RoomChat') private readonly RoomChatModel: Model<RoomChat>,
    @Inject(forwardRef(() => MessengerService))
    private readonly messengerService: MessengerService,
    private readonly shopService: ShopService,
  ) {}
  async create(
    createRoomChatDto: CreateRoomChatDto | CreateMessengerDto,
    payload: payload,
  ) {
    try {
      const newData = {
        id_customer: payload.sub,
        id_shop: createRoomChatDto.id_shop,
        theLastMess: '',
      };
      if (createRoomChatDto.id_customer) {
        const shop = await this.shopService.create(payload);
        newData.id_shop = shop._id;
        newData.id_customer = createRoomChatDto.id_customer;
      }
      const newRoomChat = await this.createRoomChat(newData);
      return newRoomChat;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createRoomChat(createRoomChatDto: CreateRoomChatDto) {
    const check = await this.RoomChatModel.findOne({
      id_customer: createRoomChatDto.id_customer,
      id_shop: createRoomChatDto.id_shop,
    });
    if (check) {
      return check;
    }
    const newRoomChat = await this.RoomChatModel.create(createRoomChatDto);
    return newRoomChat;
  }

  findAll() {
    return this.RoomChatModel.find().lean();
  }

  async findByIdCustomer(payload: payload) {
    try {
      const listRoomChat = await this.RoomChatModel.find({
        id_customer: payload.sub,
      })
        .populate({
          path: 'id_customer',
          select: ['_id', 'name', 'avata', 'phone'],
        })
        .populate({
          path: 'id_shop',
          select: ['_id', 'name', 'thumbnail', 'count_follower', 'star'],
        })
        .populate('id_lastMess')
        .populate({
          path: 'messenger',
          populate: {
            path: 'id_product',
            populate: {
              path: 'product_price',
              populate: [{ path: 'id_color' }, { path: 'id_size' }],
            },
          },
        })
        .lean();
      return this.handleThumbnailListRoom(listRoomChat);
    } catch (error) {
      console.log('Error get list Room chat by Id Customer \n', error);
      throw new InternalServerErrorException();
    }
  }
  async findByIdShop(payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      const listRoomChat = await this.RoomChatModel.find({
        id_shop: shop._id,
      })
        .populate({
          path: 'id_customer',
          select: ['_id', 'name', 'avata', 'phone'],
        })
        .populate({
          path: 'id_shop',
          select: ['_id', 'name', 'thumbnail', 'count_follower', 'star'],
        })
        .populate('id_lastMess')
        .populate({
          path: 'messenger',
          populate: {
            path: 'id_product',
            populate: {
              path: 'product_price',
              populate: [{ path: 'id_color' }, { path: 'id_size' }],
            },
          },
        })
        .lean();
      return this.handleThumbnailListRoom(listRoomChat);
    } catch (error) {
      console.log('Error get list Room chat by Id Customer \n', error);
      throw new InternalServerErrorException();
    }
  }

  async updateLastMess(_id: string, id_lastMess: string) {
    try {
      const newRoom = this.RoomChatModel.findByIdAndUpdate(_id, {
        id_lastMess,
      });
      return newRoom;
    } catch (error) {
      console.log('Error get list Room chat by Id Customer \n', error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(
    id: string,
    payload: payload,
    skip: number = 1,
    limit: number = 20,
  ) {
    const roomChat = await this.RoomChatModel.findById(id);
    const shop = await this.shopService.create(payload);
    if (
      String(roomChat.id_customer) != payload.sub &&
      String(roomChat.id_shop) != String(shop._id)
    )
      return new HttpException(
        'Bạn không có quyền truy cập tin nhắn!',
        HttpStatus.BAD_REQUEST,
      );
    const roomChatDetail = await this.RoomChatModel.findById(id)
      .populate({
        path: 'messenger',
        options: {
          skip: (skip - 1) * limit,
          limit: limit,
          sort: { _id: -1 },
        },
        populate: {
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
        },
      })
      .populate({
        path: 'id_customer',
        select: ['_id', 'name', 'avata', 'phone'],
      })
      .populate({
        path: 'id_shop',
        select: ['_id', 'name', 'thumbnail', 'count_follower', 'star'],
      })
      .populate('id_lastMess')
      .lean();

    return this.handleThumbnailRoomDetail(roomChatDetail);
  }

  update(id: string, updateRoomChatDto: UpdateRoomChatDto) {
    console.log(updateRoomChatDto);
    return `This action updates a #${id} roomChat`;
  }

  remove(id: string) {
    return `This action removes a #${id} roomChat`;
  }
  async findById(id: string) {
    return await this.RoomChatModel.findById(id);
  }

  async checkRecords(idArray) {
    try {
      const objectIdArray = idArray.map(
        (id) => new mongoose.Types.ObjectId(id),
      );
      const results = await this.RoomChatModel.find({
        id_customer: { $all: objectIdArray },
      });
      if (results.length > 0) {
        return results[0];
      } else {
        return false;
      }
    } catch {
      console.error('Phòng chưa được tạo');
    }
  }
  handleThumbnailListRoom(listRoom) {
    listRoom.forEach((room) => {
      this.handleThumbnailRoomDetail(room);
    });
    return listRoom;
  }
  handleThumbnailRoomDetail(roomDetail) {
    roomDetail.messenger.reverse();
    roomDetail.id_customer.avata = ensureUrl(roomDetail.id_customer.avata);

    roomDetail.id_shop.thumbnail = ensureUrl(roomDetail.id_shop.thumbnail);

    if (roomDetail.messenger) {
      roomDetail.messenger.forEach((mess) => {
        if (mess.thumbnail) {
          mess.thumbnail = ensureUrl(mess.thumbnail);
        }
        if (mess.video) {
          mess.video = ensureUrl(mess.video);
        }
        if (mess.id_product) {
          if (
            mess.id_product.thumbnails &&
            mess.id_product.thumbnails.length > 0
          ) {
            mess.id_product.thumbnails = mess.id_product.thumbnails.map(
              (thumb) => ensureUrl(thumb),
            );
          }
        }
      });
    }
    return roomDetail;
  }
}
const ensureUrl = (url) => {
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `${process.env.URL_API}uploads/${url}`;
  }
  return url;
};
