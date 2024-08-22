import { Module } from '@nestjs/common';
import { CardLinkService } from './card-link.service';
import { CardLinkController } from './card-link.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CardLinkSchema } from './schemas/card-link.schema';

@Module({
  imports: 
  [
    MongooseModule.forFeature([{ name: 'CardLink', schema: CardLinkSchema }]),
  ],
  controllers: [CardLinkController],
  providers: [CardLinkService],
  exports: [CardLinkService],
})
export class CardLinkModule {}
