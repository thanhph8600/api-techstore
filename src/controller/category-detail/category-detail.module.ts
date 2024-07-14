import { Module } from '@nestjs/common';
import { CategoryDetailService } from './category-detail.service';
import { CategoryDetailController } from './category-detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryDetail } from './entities/category-detail.entity';
import { CategoryModule } from '../category/category.module';
import { CategoryDetailSchema } from './schemas/category-detail.schema';

@Module({
  imports: [
    CategoryModule,
    MongooseModule.forFeature([
      { name: CategoryDetail.name, schema: CategoryDetailSchema },
    ]),
  ],
  controllers: [CategoryDetailController],
  providers: [CategoryDetailService],
  exports: [CategoryDetailService, MongooseModule],
})
export class CategoryDetailModule {}
