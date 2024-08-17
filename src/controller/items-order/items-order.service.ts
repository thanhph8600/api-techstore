import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateItemsOrderDto } from './dto/create-items-order.dto';
import { UpdateItemsOrderDto } from './dto/update-items-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItemsOrder } from './schemas/itemsOrder.schema';

@Injectable()
export class ItemsOrderService {
  constructor(
    @InjectModel('ItemsOrder')
    private readonly itemsOrderModel: Model<ItemsOrder>,
  ) {}
  async create(createItemsOrderDto: CreateItemsOrderDto) {
    try {
      const itemsOrder = new this.itemsOrderModel(createItemsOrderDto);
      return await itemsOrder.save();
    } catch (error) {
      console.log('error itemsOrder create', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all itemsOrder`;
  }
  async findByIdOrder(id: string): Promise<any> {
    try {
      const orderId = new Types.ObjectId(id);
      const itemsSubOrder: any = await this.itemsOrderModel
        .find({ orderId: orderId })
        .populate('customerId')
        .populate('shopId')
        .populate({
          path: 'items.productPriceId',
          select: 'id_color id_product id_size price stock',
          populate: [
            {
              path: 'id_color',
              select: 'value',
            },
            {
              path: 'id_product',
              select: 'name , thumbnails',
            },
            {
              path: 'id_size',
              select: 'value',
            },
          ],
        })
        .populate('items.discountDetailId')
        .populate('voucherShopId')
        .exec();
      return itemsSubOrder;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByIdCustomer(id: string): Promise<any> {
    try {
      const items: any = await this.itemsOrderModel
        .find({ customerId: id })
        .populate({
          path: 'customerId',
          select: 'name phone avata',
        })
        .populate('shopId')
        .populate({
          path: 'items.productPriceId',
          select: 'id_color id_product id_size price stock',
          populate: [
            {
              path: 'id_color',
              select: 'value',
            },
            {
              path: 'id_product',
              select: 'name , thumbnails',
            },
            {
              path: 'id_size',
              select: 'value',
            },
          ],
        })
        .populate('items.discountDetailId')
        .populate('voucherShopId')
        .populate({
          path: 'orderId',
          select: 'address voucher2t methodPayment total coin',
          populate: [
            {
              path: 'address',
            },
            {
              path: 'voucher2t',
            },
          ],
        })
        .exec();
      return items.reverse();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findById(id: string) {
    try {
      const item: any = await this.itemsOrderModel
        .findById(id)
        .populate({
          path: 'customerId',
          select: 'name phone avata',
        })
        .populate('shopId')
        .populate({
          path: 'items.productPriceId',
          select: 'id_color id_product id_size price stock',
          populate: [
            {
              path: 'id_color',
              select: 'value',
            },
            {
              path: 'id_product',
              select: 'name , thumbnails',
            },
            {
              path: 'id_size',
              select: 'value',
            },
          ],
        })
        .populate('items.discountDetailId')
        .populate('voucherShopId')
        .populate({
          path: 'orderId',
          select: 'address voucher2t methodPayment total coin',
          populate: [
            {
              path: 'address',
            },
            {
              path: 'voucher2t',
            },
          ],
        })
        .exec();
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} itemsOrder`;
  }

  update(id: number, updateItemsOrderDto: UpdateItemsOrderDto) {
    return `This action updates a #${id} itemsOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemsOrder`;
  }
}
