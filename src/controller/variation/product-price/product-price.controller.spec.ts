import { Test, TestingModule } from '@nestjs/testing';
import { ProductPriceController } from './product-price.controller';
import { ProductPriceService } from './product-price.service';

describe('ProductPriceController', () => {
  let controller: ProductPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductPriceController],
      providers: [ProductPriceService],
    }).compile();

    controller = module.get<ProductPriceController>(ProductPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
