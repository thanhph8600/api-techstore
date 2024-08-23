import { Test, TestingModule } from '@nestjs/testing';
import { AdminVoucherController } from './admin-voucher.controller';
import { AdminVoucherService } from './admin-voucher.service';

describe('AdminVoucherController', () => {
  let controller: AdminVoucherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminVoucherController],
      providers: [AdminVoucherService],
    }).compile();

    controller = module.get<AdminVoucherController>(AdminVoucherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
