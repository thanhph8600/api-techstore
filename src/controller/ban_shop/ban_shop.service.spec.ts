import { Test, TestingModule } from '@nestjs/testing';
import { BanShopService } from './ban_shop.service';

describe('BanShopService', () => {
  let service: BanShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BanShopService],
    }).compile();

    service = module.get<BanShopService>(BanShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
