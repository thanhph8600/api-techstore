import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateSpecificationDto } from './dto/create-specification.dto';
import { UpdateSpecificationDto } from './dto/update-specification.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Specification } from './schemas/specigication.schema';
import { Model } from 'mongoose';

@Injectable()
export class SpecificationService {
  constructor(
    @InjectModel(Specification.name)
    private readonly specificationModel: Model<Specification>,
  ) {}
  async create(create: CreateSpecificationDto) {
    try {
      const brand = await this.findByName(create.name);
      if (brand.length != 0) {
        return new HttpException('Tên thông số kĩ thuật đã được dùng!', 401);
      }
      const newCategory = await this.specificationModel.create(create);
      return newCategory;
    } catch (error) {
      console.log('error brand create', error);
      throw new InternalServerErrorException();
    }
  }

  findByName(name: string) {
    return this.specificationModel.find({ name });
  }

  async findAll(): Promise<Specification[]> {
    return await this.specificationModel
      .aggregate([
        {
          $lookup: {
            from: 'SpecificationsDetail',
            localField: '_id',
            foreignField: 'id_specification',
            as: 'details',
          },
        },
      ])
      .exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} specification`;
  }

  update(id: number, updateSpecificationDto: UpdateSpecificationDto) {
    console.log(updateSpecificationDto);
    return `This action updates a #${id} specification`;
  }

  remove(id: number) {
    return `This action removes a #${id} specification`;
  }
}
