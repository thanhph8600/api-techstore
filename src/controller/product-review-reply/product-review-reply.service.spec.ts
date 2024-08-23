import { Test, TestingModule } from '@nestjs/testing';
import { ProductReviewReplyService } from './product-review-reply.service';

describe('ProductReviewReplyService', () => {
  let service: ProductReviewReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductReviewReplyService],
    }).compile();

    service = module.get<ProductReviewReplyService>(ProductReviewReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
