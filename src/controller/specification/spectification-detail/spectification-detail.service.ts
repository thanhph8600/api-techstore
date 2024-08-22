import {
  HttpException,
  HttpStatus,
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
      const newCategory = new this.model(create);
      await newCategory.save()
      return new HttpException("Tạo thông số chi tiết thành công", HttpStatus.CREATED);
    } catch (error) {
      console.log('error specification detail create', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.model.find();
  }

  async findByIdSpecification(id_specification : string) {
    return await this.model.find({id_specification})
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
