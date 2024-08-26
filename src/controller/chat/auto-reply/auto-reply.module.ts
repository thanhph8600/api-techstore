import { Module } from '@nestjs/common';
import { AutoReplyService } from './auto-reply.service';
import { AutoReplyController } from './auto-reply.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AutoReply, AutoReplySchema } from './schemas/autoReply.chat.schema';
import { ShopModule } from '../../seller/shop/shop.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AutoReply.name, schema: AutoReplySchema },
    ]),
    ShopModule,
  ],
  controllers: [AutoReplyController],
  providers: [AutoReplyService],
  exports: [AutoReplyService],
})
export class AutoReplyModule {}
