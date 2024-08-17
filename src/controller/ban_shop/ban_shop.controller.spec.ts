import { Test, TestingModule } from '@nestjs/testing';
import { BanShopController } from './ban_shop.controller';
import { BanShopService } from './ban_shop.service';

describe('BanShopController', () => {
  let controller: BanShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BanShopController],
      providers: [BanShopService],
    }).compile();

    controller = module.get<BanShopController>(BanShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
