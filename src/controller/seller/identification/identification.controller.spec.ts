import { Test, TestingModule } from '@nestjs/testing';
import { IdentificationController } from './identification.controller';
import { IdentificationService } from './identification.service';

describe('IdentificationController', () => {
  let controller: IdentificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdentificationController],
      providers: [IdentificationService],
    }).compile();

    controller = module.get<IdentificationController>(IdentificationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
