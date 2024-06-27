import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryDetailService } from './category-detail.service';
import { CreateCategoryDetailDto } from './dto/create-category-detail.dto';
import { UpdateCategoryDetailDto } from './dto/update-category-detail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/middleware/auth/public';

@ApiBearerAuth()
@ApiTags('category-detail')
@Controller('category-detail')
export class CategoryDetailController {
  constructor(private readonly categoryDetailService: CategoryDetailService) {}

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
  @Get(':id')
  findbyIdCategory(@Param('id') id: string) {
    return this.categoryDetailService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDetailDto: UpdateCategoryDetailDto,
  ) {
    return this.categoryDetailService.update(id, updateCategoryDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryDetailService.remove(+id);
  }
}
