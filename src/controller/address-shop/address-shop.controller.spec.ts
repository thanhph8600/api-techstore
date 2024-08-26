import { Test, TestingModule } from '@nestjs/testing';
import { AddressShopController } from './address-shop.controller';
import { AddressShopService } from './address-shop.service';

describe('AddressShopController', () => {
  let controller: AddressShopController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressShopController],
      providers: [AddressShopService],
    }).compile();

    controller = module.get<AddressShopController>(AddressShopController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
