import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateCategoryDetailDto } from './dto/create-category-detail.dto';
import { UpdateCategoryDetailDto } from './dto/update-category-detail.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CategoryService } from '../category/category.service';
import { CategoryDetail } from './schemas/category-detail.schema';
import slugify from 'slugify';

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
      const slug = this.createSlugByName(createCategoryDetailDto.name)
      const checkSlugCategory = await this.categoryModel.findOneBySlug(
        slug,
      );
      const newSlug = category.slug + '-' + slug;
      const checkSlug = await this.findOneBySlug(newSlug);
      if (checkSlug || checkSlugCategory) {
        return new HttpException('Tên danh mục đã được dùng!', 401);
      }

      const newDetailCategory = await this.detailCategoryModel.create(
        createCategoryDetailDto,
      );
      newDetailCategory.slug = newSlug
      await newDetailCategory.save()
      return new HttpException("Tạo danh mục chi tiết thành công", HttpStatus.CREATED);
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
      return this.detailCategoryModel.findById({ _id });
    } catch (error) {
      return null;
    }
  }

  async findWhenIdCategoryById (id: string) {
    const category: CategoryDetail[] = await this.detailCategoryModel.find({id_category: id})
    if(category.length < 0) {
      return new HttpException("Danh mục không tồn tại", HttpStatus.NOT_FOUND)
    }
    return category
  }

  async updateSpecification(_id: ObjectId, specifications: string[]) {
    try {
      const category = await this.findOneByID(_id)
      if(!category) {
        return new HttpException("Danh mục không tồn tại", HttpStatus.NOT_FOUND)
      }
      if(specifications.length === 0) {
        return new HttpException("Dữ liệu thông số gửi đi không được rỗng", HttpStatus.BAD_REQUEST)
      }

      const newSpecifi = specifications.filter((spec) => !category.id_specification.includes(spec))

      const addSpecifications = this.detailCategoryModel.findByIdAndUpdate(_id,{
        $push: {id_specification: { $each: newSpecifi} }
      },{new: true}).exec()

      return new HttpException("Thêm thông số vào danh mục thành công", HttpStatus.OK)
    }catch(error) {
      return new HttpException("Lỗi khi thêm thông số vào danh mục", error)
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

  async findSpecificationById(id: string) {
    const category = await this.detailCategoryModel.findById(id)
    if(!category) {
      return new HttpException("Danh mục không tồn tại", HttpStatus.NOT_FOUND)
    }

    return category.id_specification
  }

  async findByIDCategory(id_category: ObjectId) {
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

  async remove(id: string) {
    await this.detailCategoryModel.findByIdAndDelete(id);
    return new HttpException("Xóa danh mục thành công", HttpStatus.OK)
  }
}
