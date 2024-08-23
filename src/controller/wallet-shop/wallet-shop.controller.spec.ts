import { Test, TestingModule } from '@nestjs/testing';
import { WalletShopController } from './wallet-shop.controller';
import { WalletShopService } from './wallet-shop.service';

describe('WalletShopController', () => {
  let controller: WalletShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletShopController],
      providers: [WalletShopService],
    }).compile();

    controller = module.get<WalletShopController>(WalletShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
