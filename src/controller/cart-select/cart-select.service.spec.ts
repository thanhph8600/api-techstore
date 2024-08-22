import { Test, TestingModule } from '@nestjs/testing';
import { CartSelectService } from './cart-select.service';

describe('CartSelectService', () => {
  let service: CartSelectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartSelectService],
    }).compile();

    service = module.get<CartSelectService>(CartSelectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
