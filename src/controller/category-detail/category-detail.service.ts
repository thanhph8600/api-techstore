import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDetailDto } from './dto/create-category-detail.dto';
import { UpdateCategoryDetailDto } from './dto/update-category-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { CategoryDetail } from './schemas/category-detail.schema';
import * as diacritics from 'diacritics';
@Injectable()
export class CategoryDetailService {
  constructor(
    @InjectModel('CategoryDetail')
    private readonly detailCategoryModel: Model<CategoryDetail>,
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
  fintOneByName(name: string) {
    return this.detailCategoryModel.findOne({ name: name });
  }
  async search(query: string) {
    try {
      const normalizedQuery = diacritics.remove(query)
        .replace(/[^\w\s]/g, '')  
        .replace(/\s+/g, '\\s*'); 
      const categorydetails = await this.detailCategoryModel.find().select('name slug');
      const result = categorydetails.filter(cat => {
        const normalizedCatName = diacritics.remove(cat.name);
        const normalizedCatSlug = diacritics.remove(cat.slug);
        return new RegExp(normalizedQuery, 'i').test(normalizedCatName) || new RegExp(normalizedQuery, 'i').test(normalizedCatSlug);
      });
      return result;
    } catch (error) {
      console.log('Error category detail search:', error);
      throw new InternalServerErrorException();
    }
  }
  
}
