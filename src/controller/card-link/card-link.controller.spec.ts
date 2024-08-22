import { Test, TestingModule } from '@nestjs/testing';
import { CardLinkController } from './card-link.controller';
import { CardLinkService } from './card-link.service';

describe('CardLinkController', () => {
  let controller: CardLinkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardLinkController],
      providers: [CardLinkService],
    }).compile();

    controller = module.get<CardLinkController>(CardLinkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
