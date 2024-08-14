import { forwardRef, Module } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { MessengerController } from './messenger.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Messenger, MessengerSchema } from './schemas/messenger.chat.schema';
import { RoomChatModule } from '../room-chat/room-chat.module';
import { WebSocketModule } from 'src/web-socket/web-socket.module';
import { ShopModule } from 'src/controller/seller/shop/shop.module';
import { ProductModule } from 'src/controller/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Messenger.name, schema: MessengerSchema },
    ]),
    forwardRef(() => RoomChatModule),
    WebSocketModule,
    ShopModule,
    ProductModule,
  ],
  controllers: [MessengerController],
  providers: [MessengerService],
  exports: [MessengerService],
})
export class MessengerModule {}
