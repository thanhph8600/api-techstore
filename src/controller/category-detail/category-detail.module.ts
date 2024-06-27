import { Module } from '@nestjs/common';
import { CategoryDetailService } from './category-detail.service';
import { CategoryDetailController } from './category-detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryDetail } from './entities/category-detail.entity';
import { DetailCategorySchema } from './schemas/category-detail.schema';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    CategoryModule,
    MongooseModule.forFeature([
      { name: CategoryDetail.name, schema: DetailCategorySchema },
    ]),
  ],
  controllers: [CategoryDetailController],
  providers: [CategoryDetailService],
  exports: [CategoryDetailService],
})
export class CategoryDetailModule {}
