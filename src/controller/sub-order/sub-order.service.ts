import { CreateSubOrderDto } from './dto/create-sub-order.dto';
import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubOrder } from './schemas/sub-order.schema';
import { Model, Types } from 'mongoose';
import { UpdateSubOrderDto } from './dto/update-sub-order.dto';
import { CustomerRewardService } from '../customer-reward/customer-reward.service';
import { VoucherService } from '../marketing/voucher/voucher.service';
@Injectable()
export class SubOrderService {
  constructor(@InjectModel(SubOrder.name) private subOrderModel: Model<SubOrder>,
    private readonly customerReward: CustomerRewardService,
    private readonly voucherService: VoucherService
  ) { }
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
        subOrder.total = TotalMoneyOrder + 12000;
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
        })
        .populate({
          path: 'voucher2t',
          select: 'name , percent , code, maximum_reduction',
        })
        .populate('address')
      const customerReward = await this.customerReward.findOne(id);
      const data = { subOrder, customerReward };
      return data;
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
      if (updateSubOrderDto.coin) {
        subOrder.total = subOrder.total - updateSubOrderDto.coin;
        await subOrder.save();
      }
      if (!subOrder) {
        throw new NotFoundException(`SubOrder with ID ${id} not found`);
      }
      if (updateSubOrderDto.voucher2t) {
        const dataVoucher = await this.voucherService.findByIdVoucher(updateSubOrderDto.voucher2t);
        if (dataVoucher.type === 'price') {
          const discountAmount = subOrder.total * (dataVoucher.percent / 100);
          if(discountAmount > dataVoucher.maximum_reduction){
            subOrder.totalDisCount = dataVoucher.maximum_reduction;
            subOrder.coinRefunt = 0;
            await subOrder.save();
          }else {
            subOrder.totalDisCount = discountAmount;
            subOrder.coinRefunt = 0;
            await subOrder.save();
          }
        } else if (dataVoucher.type === 'coin') {
          const coinAmount = subOrder.total * (dataVoucher.percent / 100);
          if(coinAmount > dataVoucher.maximum_reduction){
            subOrder.coinRefunt = dataVoucher.maximum_reduction;
            subOrder.totalDisCount = 0;
            await subOrder.save();
          }else {
            subOrder.coinRefunt = coinAmount;
            subOrder.totalDisCount = 0;
            await subOrder.save();
          }
        }else {
          return subOrder
        }
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
