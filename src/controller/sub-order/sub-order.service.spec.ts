import { Test, TestingModule } from '@nestjs/testing';
import { SubOrderService } from './sub-order.service';

describe('SubOrderService', () => {
  let service: SubOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubOrderService],
    }).compile();

    service = module.get<SubOrderService>(SubOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
