import { Test, TestingModule } from '@nestjs/testing';
import { CustomerFollowService } from './customer-follow.service';

describe('CustomerFollowService', () => {
  let service: CustomerFollowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerFollowService],
    }).compile();

    service = module.get<CustomerFollowService>(CustomerFollowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
