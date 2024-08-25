import { Test, TestingModule } from '@nestjs/testing';
import { WalletAdminController } from './wallet-admin.controller';
import { WalletAdminService } from './wallet-admin.service';

describe('WalletAdminController', () => {
  let controller: WalletAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletAdminController],
      providers: [WalletAdminService],
    }).compile();

    controller = module.get<WalletAdminController>(WalletAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
