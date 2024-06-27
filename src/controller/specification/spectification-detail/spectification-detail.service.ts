import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSpectificationDetailDto } from './dto/create-spectification-detail.dto';
import { UpdateSpectificationDetailDto } from './dto/update-spectification-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SpecificationsDetail } from './schemas/specigications-detail.schema';
import { Model } from 'mongoose';

@Injectable()
export class SpectificationDetailService {
  constructor(
    @InjectModel(SpecificationsDetail.name)
    private readonly model: Model<SpecificationsDetail>,
  ) {}
  async create(create: CreateSpectificationDetailDto) {
    try {
      const checkName = await this.model.findOne({
        name: create.name,
        id_specification: create.id_specification,
      });
      if (checkName) {
        return new HttpException('Tên đã được dùng!', 401);
      }
      const newCategory = await this.model.create(create);
      return newCategory;
    } catch (error) {
      console.log('error specification detail create', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.model.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} spectificationDetail`;
  }

  update(id: number, update: UpdateSpectificationDetailDto) {
    console.log(update);
    return `This action updates a #${id} spectificationDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} spectificationDetail`;
  }
}
