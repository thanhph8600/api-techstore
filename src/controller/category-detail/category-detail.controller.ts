import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CategoryDetailService } from './category-detail.service';
import { CreateCategoryDetailDto } from './dto/create-category-detail.dto';
import { UpdateCategoryDetailDto } from './dto/update-category-detail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/middleware/auth/public';
import { Model, ObjectId, } from 'mongoose';

@ApiBearerAuth()
@ApiTags('category-detail')
@Controller('category-detail')
export class CategoryDetailController {
  constructor(private readonly categoryDetailService: CategoryDetailService) {}

  @Public()
  @Post()
  create(@Body() createCategoryDetailDto: CreateCategoryDetailDto) {
    return this.categoryDetailService.create(createCategoryDetailDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.categoryDetailService.findAll();
  }

  @Public()
  @Get(':id_category')
  findbyIdCategory(@Param('id_category') id_category: ObjectId) {
    return this.categoryDetailService.findByIDCategory(id_category);
  }

  @Public()
  @Patch('/update-specification')
  async updateSpecification(@Body('_id') _id: ObjectId, @Body("specifications") specifications: string[]) {
    return await this.categoryDetailService.updateSpecification(_id, specifications)
  }

  @Public()
  @Get('/find-specification/:id')
  async findSpecification(@Param('id') id: string) {
    return await this.categoryDetailService.findSpecificationById(id)
  }

  @Public()
  @Get('/find-idcategory/:id')
  async findIdCategory(@Param('id') id: string) {
    return await this.categoryDetailService.findWhenIdCategoryById(id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDetailDto: UpdateCategoryDetailDto,
  ) {
    return this.categoryDetailService.update(id, updateCategoryDetailDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryDetailService.remove(id);
  }
}
