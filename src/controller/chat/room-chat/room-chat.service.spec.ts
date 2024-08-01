import { Test, TestingModule } from '@nestjs/testing';
import { RoomChatService } from './room-chat.service';

describe('RoomChatService', () => {
  let service: RoomChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomChatService],
    }).compile();

    service = module.get<RoomChatService>(RoomChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
