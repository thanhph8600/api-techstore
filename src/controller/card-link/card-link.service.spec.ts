import { Test, TestingModule } from '@nestjs/testing';
import { CardLinkService } from './card-link.service';

describe('CardLinkService', () => {
  let service: CardLinkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardLinkService],
    }).compile();

    service = module.get<CardLinkService>(CardLinkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
