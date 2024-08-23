import { Test, TestingModule } from '@nestjs/testing';
import { ViolateService } from './violate.service';

describe('ViolateService', () => {
  let service: ViolateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ViolateService],
    }).compile();

    service = module.get<ViolateService>(ViolateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
