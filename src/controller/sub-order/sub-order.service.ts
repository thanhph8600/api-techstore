import { CreateSubOrderDto } from './dto/create-sub-order.dto';
import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubOrder } from './schemas/sub-order.schema';
import { Model, Types } from 'mongoose';
import { UpdateSubOrderDto } from './dto/update-sub-order.dto';
@Injectable()
export class SubOrderService {
  constructor(@InjectModel(SubOrder.name) private subOrderModel: Model<SubOrder>) { }
  async create(createSubOrderDto: CreateSubOrderDto) {
    try {
      const newSubOrder = new this.subOrderModel(createSubOrderDto);
      await newSubOrder.save();
      const subOrder = await this.subOrderModel.findOne({ _id: newSubOrder._id })
        .populate({
          path: 'items.productPriceId',
          select: 'price',
        })
      const TotalMoneyOrder = subOrder.items?.reduce((total, item: any) => {
        return total + item?.productPriceId?.price * item?.quantity
      }, 0)
      if (subOrder.items.length > 0) {
        subOrder.subTotal = TotalMoneyOrder;
        subOrder.total = TotalMoneyOrder;
        await subOrder.save()
      }
      const response = {
        status: 200,
        data: subOrder
      };
      return response;
    } catch (error) {
      console.log('error cartSlecte create', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all order`;
  }

  async findOne(id: string) {
    try {
      const subOrder = await this.subOrderModel
        .findOne({ customerId: id })
        .populate({
          path: 'customerId',
          select: 'name , phone , avata',
        });
      return subOrder;
    } catch (error) {
      console.log('error cartSlecte findOne', error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateSubOrderDto: UpdateSubOrderDto) {
    try {
      const subOrder = await this.subOrderModel
        .findByIdAndUpdate(id, updateSubOrderDto, { new: true, runValidators: true });
      if (updateSubOrderDto.shipping) {
        subOrder.total = subOrder.total + subOrder.costShipping - 25000;
        await subOrder.save();
      }
      if (!subOrder) {
        throw new NotFoundException(`SubOrder with ID ${id} not found`);
      }

      return subOrder;
    } catch (error) {
      console.error('Error updating sub-order:', error.message || error);
      throw new InternalServerErrorException('Failed to update sub-order');
    }
  }

  remove(id: string) {
    try {
      return this.subOrderModel.deleteOne({ _id: new Types.ObjectId(id) });
    } catch (error) {
      console.log('error cartSlecte remove', error);
      throw new InternalServerErrorException();
    }
  }
}
