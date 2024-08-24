import { Test, TestingModule } from '@nestjs/testing';
import { WalletShopTransactionsService } from './wallet-shop-transactions.service';

describe('WalletShopTransactionsService', () => {
  let service: WalletShopTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletShopTransactionsService],
    }).compile();

    service = module.get<WalletShopTransactionsService>(
      WalletShopTransactionsService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
