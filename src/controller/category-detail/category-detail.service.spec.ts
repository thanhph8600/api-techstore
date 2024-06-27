import { Test, TestingModule } from '@nestjs/testing';
import { CategoryDetailService } from './category-detail.service';

describe('CategoryDetailService', () => {
  let service: CategoryDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryDetailService],
    }).compile();

    service = module.get<CategoryDetailService>(CategoryDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
