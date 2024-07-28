import { Module } from '@nestjs/common';
import { IdentificationService } from './identification.service';
import { IdentificationController } from './identification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Identification } from './entities/identification.entity';
import { IdentificationSchema } from './schema/identification.schema';
import { ShopModule } from '../shop/shop.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Identification.name, schema: IdentificationSchema },
    ]),
    ShopModule,
  ],
  controllers: [IdentificationController],
  providers: [IdentificationService],
})
export class IdentificationModule {}
