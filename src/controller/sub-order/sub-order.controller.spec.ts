import { Test, TestingModule } from '@nestjs/testing';
import { SubOrderController } from './sub-order.controller';
import { SubOrderService } from './sub-order.service';

describe('SubOrderController', () => {
  let controller: SubOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubOrderController],
      providers: [SubOrderService],
    }).compile();

    controller = module.get<SubOrderController>(SubOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
