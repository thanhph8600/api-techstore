import { Test, TestingModule } from '@nestjs/testing';
import { ItemsOrderController } from './items-order.controller';
import { ItemsOrderService } from './items-order.service';

describe('ItemsOrderController', () => {
  let controller: ItemsOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsOrderController],
      providers: [ItemsOrderService],
    }).compile();

    controller = module.get<ItemsOrderController>(ItemsOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
