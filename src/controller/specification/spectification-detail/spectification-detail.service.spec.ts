import { Test, TestingModule } from '@nestjs/testing';
import { SpectificationDetailService } from './spectification-detail.service';

describe('SpectificationDetailService', () => {
  let service: SpectificationDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpectificationDetailService],
    }).compile();

    service = module.get<SpectificationDetailService>(
      SpectificationDetailService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
