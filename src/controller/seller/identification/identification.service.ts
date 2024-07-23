import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateIdentificationDto } from './dto/create-identification.dto';
import { UpdateIdentificationDto } from './dto/update-identification.dto';
import { payload } from 'src/controller/customer/interface/customer.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Identification } from './schema/identification.schema';
import { Model } from 'mongoose';
import { ShopService } from '../shop/shop.service';

@Injectable()
export class IdentificationService {
  constructor(
    @InjectModel('Identification')
    private readonly identificationModel: Model<Identification>,
    private readonly shopService: ShopService,
  ) {}
  async create(payload: payload, create: CreateIdentificationDto) {
    try {
      const shop = await this.shopService.create(payload);
      create.id_shop = shop._id;
      const check = await this.findOne(payload);
      if (check) {
        return this.update(check._id, create);
      }
      return await this.identificationModel.create(create);
    } catch (error) {
      console.log('error create identification:' + error);
    }
  }

  findAll() {
    return `This action returns all identification`;
  }

  async findOne(payload: payload) {
    const shop = await this.shopService.create(payload);
    const check = await this.identificationModel.findOne({
      id_shop: shop._id,
    });
    return handleThumbnail(check);
  }

  async update(id: string, updateIdentificationDto: UpdateIdentificationDto) {
    try {
      const newIdentification =
        await this.identificationModel.findByIdAndUpdate(
          id,
          updateIdentificationDto,
        );
      return newIdentification;
    } catch (error) {
      console.log('error update identification:' + error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} identification`;
  }
}
function handleThumbnail(identification: Identification) {
  if (
    !identification.CCCD_photo.startsWith('http://') &&
    !identification.CCCD_photo.startsWith('https://')
  ) {
    identification.CCCD_photo = `${process.env.URL_API}uploads/${identification.CCCD_photo}`;
  }
  return identification;
}
