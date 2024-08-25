import { Test, TestingModule } from '@nestjs/testing';
import { WalletAdminTransactionService } from './wallet-admin-transaction.service';

describe('WalletAdminTransactionService', () => {
  let service: WalletAdminTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletAdminTransactionService],
    }).compile();

    service = module.get<WalletAdminTransactionService>(WalletAdminTransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
