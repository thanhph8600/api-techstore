import { Injectable } from '@nestjs/common';
import { CreateCustomerRewardDto } from './dto/create-customer-reward.dto';
import { UpdateCustomerRewardDto } from './dto/update-customer-reward.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose'
import { CustomerReward } from './schemas/customer-reward.schema';

@Injectable()
export class CustomerRewardService {
  constructor(
    @InjectModel ('CustomerReward') private readonly customerRewardModel: Model<CustomerReward>,
  ) {}
  async create(createCustomerRewardDto: CreateCustomerRewardDto) {
    try  {
      const newCustomerReward = new this.customerRewardModel(createCustomerRewardDto);
      await newCustomerReward.save();
      return newCustomerReward;
    } catch (error) {
      throw new Error(error);
    }
  }

  findAll() {
    return `This action returns all customerReward`;
  }

  async findOne(id: string): Promise<CustomerReward> {
    const customerReward = await this.customerRewardModel.findOne({ customerId: id }).exec();
    if(!customerReward) {
      const newCustomerReward = this.create({customerId: id, coin: 0, voucher: []});
      return newCustomerReward;
    }
    return customerReward;
  }

  update(id: number, updateCustomerRewardDto: UpdateCustomerRewardDto) {
    return `This action updates a #${id} customerReward`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerReward`;
  }
}
