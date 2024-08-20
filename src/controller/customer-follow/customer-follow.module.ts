import { Module } from '@nestjs/common';
import { CustomerFollowService } from './customer-follow.service';
import { CustomerFollowController } from './customer-follow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerFollowSchema } from './Schemas/customer-follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'CustomerFollow',
        schema: CustomerFollowSchema,
      },
    ])
  ],
  controllers: [CustomerFollowController],
  providers: [CustomerFollowService],
  exports: [CustomerFollowService],
})
export class CustomerFollowModule {}
