import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDetailDto } from './dto/create-category-detail.dto';
import { UpdateCategoryDetailDto } from './dto/update-category-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { DetailCategory } from './schemas/category-detail.schema';
import { CategoryService } from '../category/category.service';

@Injectable()
export class CategoryDetailService {
  constructor(
    @InjectModel('CategoryDetail')
    private readonly detailCategoryModel: Model<DetailCategory>,
    private readonly categoryModel: CategoryService,
  ) {}
  async create(createCategoryDetailDto: CreateCategoryDetailDto) {
    try {
      const category = await this.findOneByIDCategory(
        createCategoryDetailDto.id_category,
      );
      const checkSlugCategory = await this.categoryModel.findOneBySlug(
        createCategoryDetailDto.slug,
      );
      createCategoryDetailDto.slug =
        category.slug + '-' + createCategoryDetailDto.slug;
      const checkSlug = await this.findOneBySlug(createCategoryDetailDto.slug);
      if (checkSlug || checkSlugCategory) {
        return new HttpException('Tên danh mục đã được dùng!', 401);
      }

      const newDetailCategory = await this.detailCategoryModel.create(
        createCategoryDetailDto,
      );
      return newDetailCategory;
    } catch (error) {
      console.log('error add category detail', error);
      throw new InternalServerErrorException();
    }
  }

  findOneBySlug(slug: string) {
    try {
      return this.detailCategoryModel.findOne({ slug });
    } catch (error) {
      console.log('error category detail findOneBySlug ', error);
      throw new InternalServerErrorException();
    }
  }

  findOneByID(_id: ObjectId) {
    try {
      return this.detailCategoryModel.findById({ _id });
    } catch (error) {
      return null;
    }
  }

  async findOneByIDCategory(id_category: ObjectId) {
    try {
      const category = await this.categoryModel.findOneByID(id_category);
      const categorydetail = await this.findOneByID(id_category);
      return category || categorydetail;
    } catch (error) {
      return null;
    }
  }

  async findByIDCategory(id_category: string) {
    try {
      const categorydetails = await this.detailCategoryModel.find({
        id_category: id_category,
      });
      return categorydetails;
    } catch (error) {
      console.log('error category detail findOneBySlug ', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    try {
      return this.detailCategoryModel.find();
    } catch (error) {
      console.log('error category detail findAll ', error);
      throw new InternalServerErrorException();
    }
  }

  findOne(id: string) {
    return this.detailCategoryModel.findById(id);
  }

  update(id: string, updateCategoryDetailDto: UpdateCategoryDetailDto) {
    try {
      return this.detailCategoryModel.findByIdAndUpdate(
        id,
        updateCategoryDetailDto,
      );
    } catch (error) {
      console.log('error category detail update ', error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} categoryDetail`;
  }
}
