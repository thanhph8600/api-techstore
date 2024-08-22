import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateAutoReplyDto } from './dto/create-auto-reply.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AutoReply } from './schemas/autoReply.chat.schema';
import { ShopService } from '../../seller/shop/shop.service';
import { payload } from '../../customer/interface/customer.interface';

@Injectable()
export class AutoReplyService {
  constructor(
    @InjectModel('AutoReply') private readonly autoReplyModel: Model<AutoReply>,
    private readonly shopService: ShopService,
  ) {}
  async create(createAutoReplyDto: CreateAutoReplyDto, payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      createAutoReplyDto.id_shop = shop._id;
      const autoReplyShop = await this.autoReplyModel.findOne({
        id_shop: shop._id,
      });
      if (createAutoReplyDto.status) {
        if (!createAutoReplyDto.content.trim()) {
          return new HttpException(
            'Nội dung tin nhắn không được để trống!',
            HttpStatus.CONFLICT,
          );
        }
      }
      if (autoReplyShop) {
        return this.autoReplyModel.findByIdAndUpdate(
          autoReplyShop._id,
          createAutoReplyDto,
        );
      }
      return await this.autoReplyModel.create(createAutoReplyDto);
    } catch (error) {
      console.log('error create auto reply');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findByShop(payload: payload) {
    const shop = await this.shopService.create(payload);
    return this.findByIdShop(shop._id);
  }

  async findByIdShop(id_shop: string) {
    const autoReplyShop = await this.autoReplyModel.findOne({
      id_shop,
    });
    return autoReplyShop;
  }
}
