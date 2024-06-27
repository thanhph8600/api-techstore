import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './schemas/brand.schema';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private readonly brandModel: Model<Brand>,
  ) {}
  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = await this.findOneByName(createBrandDto.name);
      if (brand.length != 0) {
        return new HttpException('Tên thương hiệu đã được dùng!', 401);
      }
      const newCategory = await this.brandModel.create(createBrandDto);
      return newCategory;
    } catch (error) {
      console.log('error brand create', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return this.brandModel.find();
  }

  findOne(id: number) {
    try {
      return this.brandModel.findById({ id });
    } catch (error) {
      console.log('error brand findOne ', error);
      throw new InternalServerErrorException();
    }
  }

  findOneByName(name: string) {
    return this.brandModel.find({ name });
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    try {
      return this.brandModel.findByIdAndUpdate(id, updateBrandDto);
    } catch (error) {
      console.log('error brand update ', error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: string) {
    try {
      return this.brandModel.findByIdAndDelete(id);
    } catch (error) {
      console.log('error brand remove ', error);
      throw new InternalServerErrorException();
    }
  }

  convertToSlug(str: string): string {
    const vietnameseMap: Record<string, string> = {
      a: 'áàảãạăắằẳẵặâấầẩẫậÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬ',
      d: 'đĐ',
      e: 'éèẻẽẹêếềểễệÉÈẺẼẸÊẾỀỂỄỆ',
      i: 'íìỉĩịÍÌỈĨỊ',
      o: 'óòỏõọôốồổỗộơớờởỡợÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢ',
      u: 'úùủũụưứừửữựÚÙỦŨỤƯỨỪỬỮỰ',
      y: 'ýỳỷỹỵYÝỲỶỸỴ',
    };
    const regex = /[a-zA-Z0-9\s]/g;

    const filteredString = str
      .split('')
      .map((char) => {
        for (const key in vietnameseMap) {
          if (vietnameseMap[key].includes(char)) {
            return key;
          }
        }
        return char;
      })
      .join('')
      .match(regex)
      ?.join('')
      .replace(/\s+/g, '-')
      .toLowerCase();

    return filteredString || '';
  }
}
