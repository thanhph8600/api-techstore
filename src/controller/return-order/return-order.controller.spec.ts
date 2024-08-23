import { Test, TestingModule } from '@nestjs/testing';
import { ReturnOrderController } from './return-order.controller';
import { ReturnOrderService } from './return-order.service';

describe('ReturnOrderController', () => {
  let controller: ReturnOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReturnOrderController],
      providers: [ReturnOrderService],
    }).compile();

    controller = module.get<ReturnOrderController>(ReturnOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
