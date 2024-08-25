import { Test, TestingModule } from '@nestjs/testing';
import { WalletAdminService } from './wallet-admin.service';

describe('WalletAdminService', () => {
  let service: WalletAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletAdminService],
    }).compile();

    service = module.get<WalletAdminService>(WalletAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
