import { Test, TestingModule } from '@nestjs/testing';
import { VoucherWalletController } from './voucher-wallet.controller';
import { VoucherWalletService } from './voucher-wallet.service';

describe('VoucherWalletController', () => {
  let controller: VoucherWalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoucherWalletController],
      providers: [VoucherWalletService],
    }).compile();

    controller = module.get<VoucherWalletController>(VoucherWalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
