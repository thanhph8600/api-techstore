import { Module } from '@nestjs/common';
import { CustomerRewardService } from './customer-reward.service';
import { CustomerRewardController } from './customer-reward.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerReward, CustomerRewardSchema } from './schemas/customer-reward.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CustomerReward.name, schema: CustomerRewardSchema }]),
  ],
  controllers: [CustomerRewardController],
  providers: [CustomerRewardService],
  exports: [CustomerRewardService]
})
export class CustomerRewardModule {}
