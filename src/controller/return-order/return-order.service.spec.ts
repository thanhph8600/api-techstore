import { Test, TestingModule } from '@nestjs/testing';
import { ReturnOrderService } from './return-order.service';

describe('ReturnOrderService', () => {
  let service: ReturnOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReturnOrderService],
    }).compile();

    service = module.get<ReturnOrderService>(ReturnOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
