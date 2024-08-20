import { Module } from '@nestjs/common';
import { MessageShortCutService } from './message-short-cut.service';
import { MessageShortCutController } from './message-short-cut.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MessageShortCut,
  MessageShortCutSchema,
} from './schemas/shortCut.chat.schema';
import { ShopModule } from 'src/controller/seller/shop/shop.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MessageShortCut.name, schema: MessageShortCutSchema },
    ]),
    ShopModule,
  ],
  controllers: [MessageShortCutController],
  providers: [MessageShortCutService],
})
export class MessageShortCutModule {}
