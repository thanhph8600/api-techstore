import { CreateSubOrderDto } from './dto/create-sub-order.dto';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubOrder } from './schemas/sub-order.schema';
import { Model, Types } from 'mongoose';
import { UpdateSubOrderDto } from './dto/update-sub-order.dto';
import { CustomerRewardService } from '../customer-reward/customer-reward.service';
import { VoucherService } from '../marketing/voucher/voucher.service';
import { ItemsSubOrderService } from '../items-sub-order/items-sub-order.service';
@Injectable()
export class SubOrderService {
  constructor(
    @InjectModel('SubOrder') private subOrderModel: Model<SubOrder>,
    private readonly customerReward: CustomerRewardService,
    private readonly voucherService: VoucherService,
    private readonly itemsSubOrderService: ItemsSubOrderService,
  ) { }
  async create(createSubOrderDto: CreateSubOrderDto) {
    try {
      const checkSubOrderIsExist = await this.subOrderModel.findOne({
        customerId: createSubOrderDto.customerId,
      })
      if(checkSubOrderIsExist) {
        await this.remove(checkSubOrderIsExist._id)
      }
      const newSubOrder = new this.subOrderModel(createSubOrderDto);
      const saveItems = createSubOrderDto.items.map(async (item) => {
        await this.itemsSubOrderService.create({
          ...item,
          subOrderId: newSubOrder._id,
          customerId: newSubOrder.customerId,
          shopId: item.shopId._id,
        });
      });
      await Promise.all(saveItems);
      await newSubOrder.save();

      const response = {
        status: 200,
        data: newSubOrder,
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
        .populate('address');
      const listProduct = await this.itemsSubOrderService.findByIdSubOrder(
        subOrder._id,
      );
      const customerReward = await this.customerReward.findOne(id);
      const totalSubOrder = listProduct.reduce((acc: number, item: any) => {
        if (item.discount > 0) {
          const price = item.total - item.discount + item.costShipping;
          return acc + price;
        } else {
          return acc + item.total + item.costShipping;
        }
      }, 0);
      if (subOrder.coin > 0) {
        subOrder.total = totalSubOrder - subOrder.coin;
      } else {
        subOrder.total = totalSubOrder;
      }
      const coinRefunt = listProduct.reduce((acc: number, item: any) => {
        return acc + item.coin;
      }, 0);
      subOrder.coinRefunt = coinRefunt;
      const discountShop = listProduct.reduce((acc: number, item: any) => {
        return acc + item.discount;
      }, 0);
      subOrder.totalDiscountShop = discountShop;
      const costShipping = listProduct.reduce((acc: number, item: any) => {
        return acc + item.costShipping;
      }, 0);
      subOrder.costShipping = costShipping;

      await subOrder.save();
      const data = { subOrder, customerReward, listProduct };
      return data;
    } catch (error) {
      console.log('error cartSlecte findOne', error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateSubOrderDto: UpdateSubOrderDto) {
    try {
      const subOrder = await this.subOrderModel.findByIdAndUpdate(
        id,
        updateSubOrderDto,
        { new: true, runValidators: true },
      );
      if (updateSubOrderDto.coin) {
        const checkCoin = updateSubOrderDto.coin >= subOrder.total;
        if (checkCoin) {
          subOrder.coin = subOrder.total;
          subOrder.total = subOrder.total - updateSubOrderDto.coin;
          await subOrder.save();
        } else {
          throw new NotFoundException(`Đã có lỗi xảy ra`);
        }
      }
      if (!subOrder) {
        throw new NotFoundException(`SubOrder with ID ${id} not found`);
      }
      if (updateSubOrderDto.voucher2t) {
        const dataVoucher = await this.voucherService.findByIdVoucher(
          updateSubOrderDto.voucher2t,
        );

        if (dataVoucher.type === 'price') {
          const discountAmount = subOrder.total * (dataVoucher.percent / 100);
          const discountToApply = discountAmount > dataVoucher.maximum_reduction
            ? dataVoucher.maximum_reduction
            : discountAmount;
          subOrder.totalDisCount = discountToApply;
          subOrder.coinRefunt = 0;
          subOrder.total = subOrder.total - discountToApply;
        } else if (dataVoucher.type === 'coin') {
          const coinAmount = subOrder.total * (dataVoucher.percent / 100);
          const coinToApply = coinAmount > dataVoucher.maximum_reduction
            ? dataVoucher.maximum_reduction
            : coinAmount;
          subOrder.coinRefunt = coinToApply;
          subOrder.totalDisCount = 0;
        }
      }
      const savedOrder = await subOrder.save();
      return savedOrder;
    } catch (error) {
      console.error('Error updating sub-order:', error.message || error);
      throw new InternalServerErrorException('Failed to update sub-order');
    }
  }
  async remove(id: string) {
    try {
      const delItemsSubOrder =
        await this.itemsSubOrderService.removeByIdSubOrder(id);
      if (delItemsSubOrder) {
        return this.subOrderModel.deleteOne({ _id: new Types.ObjectId(id) });
      }
    } catch (error) {
      console.log('error cartSlecte remove', error);
      throw new InternalServerErrorException();
    }
  }
}
