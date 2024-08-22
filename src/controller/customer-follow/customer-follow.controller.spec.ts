import { Test, TestingModule } from '@nestjs/testing';
import { CustomerFollowController } from './customer-follow.controller';
import { CustomerFollowService } from './customer-follow.service';

describe('CustomerFollowController', () => {
  let controller: CustomerFollowController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerFollowController],
      providers: [CustomerFollowService],
    }).compile();

    controller = module.get<CustomerFollowController>(CustomerFollowController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
