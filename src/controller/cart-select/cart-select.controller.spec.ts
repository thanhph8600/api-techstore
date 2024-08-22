import { Test, TestingModule } from '@nestjs/testing';
import { CartSelectController } from './cart-select.controller';
import { CartSelectService } from './cart-select.service';

describe('CartSelectController', () => {
  let controller: CartSelectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartSelectController],
      providers: [CartSelectService],
    }).compile();

    controller = module.get<CartSelectController>(CartSelectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
