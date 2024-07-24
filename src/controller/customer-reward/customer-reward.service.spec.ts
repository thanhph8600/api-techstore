import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRewardService } from './customer-reward.service';

describe('CustomerRewardService', () => {
  let service: CustomerRewardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerRewardService],
    }).compile();

    service = module.get<CustomerRewardService>(CustomerRewardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
