import { Module } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { SpecificationController } from './specification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SpectificationDetailModule } from '../spectification-detail/spectification-detail.module';
import {
  Specification,
  SpecificationSchema,
} from './schemas/specigication.schema';

@Module({
  imports: [
    SpectificationDetailModule,
    MongooseModule.forFeature([
      { name: Specification.name, schema: SpecificationSchema },
    ]),
  ],
  controllers: [SpecificationController],
  providers: [SpecificationService],
})
export class SpecificationModule {}
