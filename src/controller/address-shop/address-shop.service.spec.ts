import { Test, TestingModule } from '@nestjs/testing';
import { AddressShopService } from './address-shop.service';

describe('AddressShopService', () => {
  let service: AddressShopService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressShopService],
    }).compile();

    service = module.get<AddressShopService>(AddressShopService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
