import { Module } from '@nestjs/common';
import { ViolateService } from './violate.service';
import { ViolateController } from './violate.controller';

@Module({
  controllers: [ViolateController],
  providers: [ViolateService],
})
export class ViolateModule {}
