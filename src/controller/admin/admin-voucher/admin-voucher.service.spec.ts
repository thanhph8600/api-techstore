import { Test, TestingModule } from '@nestjs/testing';
import { AdminVoucherService } from './admin-voucher.service';

describe('AdminVoucherService', () => {
  let service: AdminVoucherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminVoucherService],
    }).compile();

    service = module.get<AdminVoucherService>(AdminVoucherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
