import { Module } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Identification } from './entities/identification.entity';
import { IdentificationSchema } from './schema/identification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identification.name, schema: IdentificationSchema },
    ]),
  ],
  controllers: [IdentificationController],
  providers: [IdentificationService],
})
export class IdentificationModule {}
