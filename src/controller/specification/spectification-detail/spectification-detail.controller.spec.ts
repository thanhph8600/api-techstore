import { Test, TestingModule } from '@nestjs/testing';
import { SpectificationDetailController } from './spectification-detail.controller';
import { SpectificationDetailService } from './spectification-detail.service';

describe('SpectificationDetailController', () => {
  let controller: SpectificationDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpectificationDetailController],
      providers: [SpectificationDetailService],
    }).compile();

    controller = module.get<SpectificationDetailController>(
      SpectificationDetailController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
