import { Test, TestingModule } from '@nestjs/testing';
import { WalletAdminTransactionController } from './wallet-admin-transaction.controller';
import { WalletAdminTransactionService } from './wallet-admin-transaction.service';

describe('WalletAdminTransactionController', () => {
  let controller: WalletAdminTransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletAdminTransactionController],
      providers: [WalletAdminTransactionService],
    }).compile();

    controller = module.get<WalletAdminTransactionController>(WalletAdminTransactionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
