import { Test, TestingModule } from '@nestjs/testing';
import { ProductReviewReplyController } from './product-review-reply.controller';
import { ProductReviewReplyService } from './product-review-reply.service';

describe('ProductReviewReplyController', () => {
  let controller: ProductReviewReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductReviewReplyController],
      providers: [ProductReviewReplyService],
    }).compile();

    controller = module.get<ProductReviewReplyController>(
      ProductReviewReplyController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
