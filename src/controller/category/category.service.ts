import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Category } from './schemas/category.schema';
import slugify from 'slugify';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
  ) {}
  async create( createCategoryDto: CreateCategoryDto, thumbnail: Express.Multer.File) {
    try {
      // const category = this.findOneBySlug(createCategoryDto.slug);
      // console.log(category);
      // if (category) {
      //   return new HttpException('Tên danh mục đã được dùng!', 401);
      // }
      const slug = this.createSlugByName(createCategoryDto.name)
      const newCategory = await this.categoryModel.create(createCategoryDto);
      newCategory.thumbnail = `${process.env.URL_API}uploads/${thumbnail.filename}`
      newCategory.slug = slug
      await newCategory.save();
      return new HttpException("Tạo danh mục thành công", HttpStatus.CREATED) 
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
      return this.categoryModel.findOne({ slug: slug });
    } catch (error) {
      console.log('error category findOneBySlug ', error);
      throw new InternalServerErrorException();
    }
  }
  slugifyOptions = {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
    replacement: '-',
    locale: 'vi', // Thiết lập locale là 'vi' cho tiếng Việt
    customReplacements: {
    'Đ': 'D', 'đ': 'd',
    'Á': 'A', 'á': 'a',
    'À': 'A', 'à': 'a',
    'Ả': 'A', 'ả': 'a',
    'Ã': 'A', 'ã': 'a',
    'Ạ': 'A', 'ạ': 'a',
    'Ă': 'A', 'ă': 'a',
    'Ắ': 'A', 'ắ': 'a',
    'Ằ': 'A', 'ằ': 'a',
    'Ẳ': 'A', 'ẳ': 'a',
    'Ẵ': 'A', 'ẵ': 'a',
    'Ặ': 'A', 'ặ': 'a',
    'Â': 'A', 'â': 'a',
    'Ấ': 'A', 'ấ': 'a',
    'Ầ': 'A', 'ầ': 'a',
    'Ẩ': 'A', 'ẩ': 'a',
    'Ẫ': 'A', 'ẫ': 'a',
    'Ậ': 'A', 'ậ': 'a',
  },
  }

  createSlugByName(name: string) {
    return slugify(name, this.slugifyOptions)
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

  async updateThumbnail(_id: string, thumbnail: Express.Multer.File) {
    const category = await this.categoryModel.findById(_id);
    if(!category) {
      throw new NotFoundException('Không tìm thấy danh mục');
    }

    category.thumbnail = `${process.env.URL_API}uploads/${thumbnail.filename}`
    await category.save()

    return category
  }
}
