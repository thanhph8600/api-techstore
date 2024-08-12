import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateBanShopDto } from './dto/create-ban_shop.dto';
import { UpdateBanShopDto } from './dto/update-ban_shop.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BanShop } from './schemas/ban_shop.schemas';


@Injectable()
export class BanShopService {
  constructor(@InjectModel('BanShop') private readonly BanShopModel: Model<BanShop>) {}


  async create(createBanShopDto: CreateBanShopDto):Promise<HttpException> {
    try {
      const createdBanShop = new this.BanShopModel(createBanShopDto)
      await createdBanShop.save();
      return new HttpException("Cấm cửa hàng thành công", HttpStatus.CREATED)
    } catch(error) {
      if (error.name === 'ValidationError') {
        throw new BadRequestException('Xác minh thất bại: ' + error.message);
      } else {
        throw new InternalServerErrorException('Lỗi kết nối máy chủ nội bộ');
      }
    }
  }

  async findAll(): Promise<BanShop[]> {
    return this.BanShopModel.find().exec();
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} banShop`;
  // }

  async findByIdShop(id_shop: string) {
    return await this.BanShopModel.findOne({ id_shop }).exec()
  }

  async updateByIdShop(id_shop: string, updateBanShopDto: UpdateBanShopDto): Promise<BanShop | null> {
    try {
      const updatedBanShop = await this.BanShopModel.findOneAndUpdate(
        {id_shop},
        { ...updateBanShopDto, $inc: { numberOfBan: 1 } },
        { new: true }
      ).exec();
      
      return updatedBanShop;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} banShop`;
  }
  
  async checkIfShopIsBanned(id_shop : string): Promise<{ isBanned: boolean, remainingBanTime?: number }> {
    const banShop = await this.BanShopModel.findOne({id_shop}).exec()

    if(!banShop) {
      return {isBanned: false};
    }

    const now = new Date();

    if(banShop.banEndDate > now) {
      const remainingBanTime = banShop.banEndDate.getTime() - now.getTime();
      return {isBanned: true, remainingBanTime}
    }

    return {isBanned: false};
  }

}
