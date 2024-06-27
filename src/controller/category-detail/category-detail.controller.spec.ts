import { Test, TestingModule } from '@nestjs/testing';
import { CategoryDetailController } from './category-detail.controller';
import { CategoryDetailService } from './category-detail.service';

describe('CategoryDetailController', () => {
  let controller: CategoryDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryDetailController],
      providers: [CategoryDetailService],
    }).compile();

    controller = module.get<CategoryDetailController>(CategoryDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
