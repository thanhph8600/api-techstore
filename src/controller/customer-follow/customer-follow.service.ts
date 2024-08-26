import { Injectable } from '@nestjs/common';
import { CreateCustomerFollowDto } from './dto/create-customer-follow.dto';
import { UpdateCustomerFollowDto } from './dto/update-customer-follow.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerFollow } from './Schemas/customer-follow.schema';

@Injectable()
export class CustomerFollowService {
  constructor(
    @InjectModel('CustomerFollow')
    private readonly customerFollowModel: Model<CustomerFollow>,
  ) {}
  create(createCustomerFollowDto: CreateCustomerFollowDto) {
    return this.customerFollowModel.create(createCustomerFollowDto);
  }

  findAll() {
    return `This action returns all customerFollow`;
  }

  async follow(id: string, customerId: string) {
    const checkIfFollow = await this.customerFollowModel.findOne({
      customerId,
      shopId: id,
    });
    if (checkIfFollow) return await this.remove(checkIfFollow._id.toString());

    return await this.create({ customerId, shopId: id });
  }

  async findByShopId(id: string) {
    return await this.customerFollowModel.find({ shopId: id });
  }
  findOne(id: number) {
    return `This action returns a #${id} customerFollow`;
  }

  update(id: number, updateCustomerFollowDto: UpdateCustomerFollowDto) {
    return `This action updates a #${id} customerFollow`;
  }

  remove(id: string) {
    return this.customerFollowModel.deleteOne({ _id: id });
  }
}
