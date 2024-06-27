import { Module } from '@nestjs/common';
import { SpectificationDetailService } from './spectification-detail.service';
import { SpectificationDetailController } from './spectification-detail.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SpecificationsDetail,
  SpecificationsDetailSchema,
} from './schemas/specigications-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpecificationsDetail.name, schema: SpecificationsDetailSchema },
    ]),
  ],
  controllers: [SpectificationDetailController],
  providers: [SpectificationDetailService],
  exports: [SpectificationDetailService],
})
export class SpectificationDetailModule {}
