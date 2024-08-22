import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateCardLinkDto } from './dto/create-card-link.dto';
import { UpdateCardLinkDto } from './dto/update-card-link.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CardLink } from './schemas/card-link.schema';

@Injectable()
export class CardLinkService {
  constructor(
    @InjectModel('CardLink') private cardLinkModel: Model<CardLink>,
  ) {}
  create(createCardLinkDto: CreateCardLinkDto) {
    const listCvvIsValid = [661,887, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 899];
    const checkCardIsTrue = listCvvIsValid.includes(createCardLinkDto.cvv)
    if(!checkCardIsTrue){
      return {
        status: 290,
        message: 'Thẻ bị từ chối',
      };
    }
    return this.cardLinkModel.create(createCardLinkDto);
  }

  findAll() {
    return `This action returns all cardLink`;
  }

  async findByIdWallet(id: string) {
    try {
      const cardLink = await this.cardLinkModel
        .find({ walletId: id })
        .select('cardHolderName , cardNumber , walletId')
        .populate('walletId')
        .exec();
      return cardLink;
    } catch (error) {
      throw new Error(error);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} cardLink`;
  }

  update(id: number, updateCardLinkDto: UpdateCardLinkDto) {
    return `This action updates a #${id} cardLink`;
  }

  remove(id: number) {
    return `This action removes a #${id} cardLink`;
  }
}
