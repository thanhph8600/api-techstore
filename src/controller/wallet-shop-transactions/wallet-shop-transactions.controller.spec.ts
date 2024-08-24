import { Test, TestingModule } from '@nestjs/testing';
import { WalletShopTransactionsController } from './wallet-shop-transactions.controller';
import { WalletShopTransactionsService } from './wallet-shop-transactions.service';

describe('WalletShopTransactionsController', () => {
  let controller: WalletShopTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletShopTransactionsController],
      providers: [WalletShopTransactionsService],
    }).compile();

    controller = module.get<WalletShopTransactionsController>(
      WalletShopTransactionsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
