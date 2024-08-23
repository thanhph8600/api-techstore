import { Injectable } from '@nestjs/common';
import { CreateReturnOrderDto } from './dto/create-return-order.dto';
import { UpdateReturnOrderDto } from './dto/update-return-order.dto';

@Injectable()
export class ReturnOrderService {
  create(createReturnOrderDto: CreateReturnOrderDto) {
    return 'This action adds a new returnOrder';
  }

  findAll() {
    return `This action returns all returnOrder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} returnOrder`;
  }

  update(id: number, updateReturnOrderDto: UpdateReturnOrderDto) {
    return `This action updates a #${id} returnOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} returnOrder`;
  }
}
