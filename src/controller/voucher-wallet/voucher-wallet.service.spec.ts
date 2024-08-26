import { Test, TestingModule } from '@nestjs/testing';
import { VoucherWalletService } from './voucher-wallet.service';

describe('VoucherWalletService', () => {
  let service: VoucherWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoucherWalletService],
    }).compile();

    service = module.get<VoucherWalletService>(VoucherWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
