import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateMessageShortCutDto } from './dto/create-message-short-cut.dto';
import { UpdateMessageShortCutDto } from './dto/update-message-short-cut.dto';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopService } from 'src/controller/seller/shop/shop.service';
import { MessageShortCut } from './schemas/shortCut.chat.schema';

@Injectable()
export class MessageShortCutService {
  constructor(
    @InjectModel(MessageShortCut.name)
    private readonly shortCutModel: Model<MessageShortCut>,
    private readonly shopService: ShopService,
  ) {}
  async create(create: CreateMessageShortCutDto, payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      create.id_shop = shop._id;
      for (const item of create.contents) {
        if (typeof item !== 'string')
          return new HttpException(
            'Nội dung tin nhắn phải là text!',
            HttpStatus.CONFLICT,
          );
      }

      const list = await this.shortCutModel.find({ id_shop: shop._id });
      const group_names = list.flatMap((item) => item.group_name);
      if (group_names.includes(create.group_name)) {
        const itemShortCut = list.find(
          (item) => item.group_name === create.group_name,
        );
        if (itemShortCut._id) {
          const update = await this.shortCutModel.findByIdAndUpdate(
            itemShortCut._id,
            create,
          );
          return update;
        }
      }
      const newMess = await this.shortCutModel.create(create);
      return newMess;
    } catch (error) {
      console.log('error create shor cut mess');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findByShop(payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      const list = await this.shortCutModel.find({ id_shop: shop._id });
      return list;
    } catch (error) {
      console.log('error findByShop shor cut mess');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findMessShortCutSample() {
    try {
      const list = await this.shortCutModel.find({ group_name: 'Mẫu có sẵn' });
      return list.find((item) => !item.id_shop);
    } catch (error) {
      console.log('error findByShop shor cut mess');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findById(id: string) {
    try {
      const item = await this.shortCutModel.findById(id);
      return item;
    } catch (error) {
      console.log('error findByShop shor cut mess');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, update: UpdateMessageShortCutDto, payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      const shortMess = await this.shortCutModel.findById(id);
      if (String(shortMess.id_shop) !== String(shop._id)) {
        return new HttpException(
          'Bạn không có quyền cập nhật tin nhắn này!',
          HttpStatus.CONFLICT,
        );
      }
      const updateShortCut = await this.shortCutModel.findByIdAndUpdate(
        id,
        update,
      );
      return updateShortCut;
    } catch (error) {
      console.log('error update shor cut mess');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string, payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      const shortMess = await this.shortCutModel.findById(id);
      if (String(shortMess.id_shop) !== String(shop._id)) {
        return new HttpException(
          'Bạn không có quyền xóa tin nhắn này!',
          HttpStatus.CONFLICT,
        );
      }

      return await this.shortCutModel.findByIdAndDelete(id);
    } catch (error) {
      console.log('error update shor cut mess');
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
