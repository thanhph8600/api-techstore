import { Test, TestingModule } from '@nestjs/testing';
import { WalletShopService } from './wallet-shop.service';

describe('WalletShopService', () => {
  let service: WalletShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletShopService],
    }).compile();

    service = module.get<WalletShopService>(WalletShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
