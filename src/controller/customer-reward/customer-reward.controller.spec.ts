import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRewardController } from './customer-reward.controller';
import { CustomerRewardService } from './customer-reward.service';

describe('CustomerRewardController', () => {
  let controller: CustomerRewardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerRewardController],
      providers: [CustomerRewardService],
    }).compile();

    controller = module.get<CustomerRewardController>(CustomerRewardController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
