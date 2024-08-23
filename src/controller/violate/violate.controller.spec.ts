import { Test, TestingModule } from '@nestjs/testing';
import { ViolateController } from './violate.controller';
import { ViolateService } from './violate.service';

describe('ViolateController', () => {
  let controller: ViolateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ViolateController],
      providers: [ViolateService],
    }).compile();

    controller = module.get<ViolateController>(ViolateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
