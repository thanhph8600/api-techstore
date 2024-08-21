import { Test, TestingModule } from '@nestjs/testing';
import { WalletTransactionsController } from './wallet-transactions.controller';
import { WalletTransactionsService } from './wallet-transactions.service';

describe('WalletTransactionsController', () => {
  let controller: WalletTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletTransactionsController],
      providers: [WalletTransactionsService],
    }).compile();

    controller = module.get<WalletTransactionsController>(WalletTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
