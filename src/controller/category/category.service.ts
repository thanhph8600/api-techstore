import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.findOneBySlug(createCategoryDto.slug);
      if (category) {
        return new HttpException('Tên danh mục đã được dùng!', 401);
      }
      const newCategory = await this.categoryModel.create(createCategoryDto);
      return newCategory;
    } catch (error) {
      console.log('error add category', error);
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const listCategories = await this.categoryModel.find();
      return listCategories;
    } catch (error) {
      console.log('error find all category', error);
      throw new InternalServerErrorException();
    }
  }

  findOneBySlug(slug: string) {
    try {
      return this.categoryModel.findOne({ slug });
    } catch (error) {
      console.log('error category findOneBySlug ', error);
      throw new InternalServerErrorException();
    }
  }

  findOneByID(_id: ObjectId) {
    try {
      return this.categoryModel.findOne({ _id });
    } catch (error) {
      return null;
    }
  }

  update(id: string, UpdateCategoryDto: UpdateCategoryDto) {
    try {
      return this.categoryModel.findByIdAndUpdate(id, UpdateCategoryDto);
    } catch (error) {
      console.log('error category detail update ', error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
  async search(query: string) {    
    try {
      const categories = await this.categoryModel
        .find({
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { slug: { $regex: query, $options: 'i' } },
          ],
        }).select('name slug')
        .limit(10);
      return categories;
    } catch (error) {
      console.log('error category search ', error);
      throw new InternalServerErrorException();
    }
  }
}
