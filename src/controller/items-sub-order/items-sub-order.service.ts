import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateItemsSubOrderDto } from './dto/create-items-sub-order.dto';
import { UpdateItemsSubOrderDto } from './dto/update-items-sub-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ItemsSubOrder } from './schemas/itemsSubOrder.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ItemsSubOrderService {
  constructor(
    @InjectModel('ItemsSubOrder')
    private readonly itemsSubOrderModule: Model<ItemsSubOrder>,
  ) {}
  async create(createItemsSubOrderDto: CreateItemsSubOrderDto) {
    try {
      const itemsSubOrder = await this.itemsSubOrderModule.create(
        createItemsSubOrderDto,
      );
      const newIdItemsSubOrder = itemsSubOrder._id.toString();
      const item = await this.findById(newIdItemsSubOrder);
      if (item) {
        const totalPriceInListItem = item.items.reduce(
          (acc: number, item: any) => {
            if (item.discountDetailId) {
              const price =
                (item.productPriceId.price *
                  item.quantity *
                  (100 - item.discountDetailId.percent)) /
                100;
              return acc + price;
            } else {
              const price = item.productPriceId.price * item.quantity;
              return acc + price;
            }
          },
          0,
        );
        await this.itemsSubOrderModule.updateOne(
          { _id: item._id },
          { total: totalPriceInListItem },
        );
      }

      return itemsSubOrder;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all itemsSubOrder`;
  }

  async findByIdSubOrder(id: string): Promise<any> {
    try {
      const idSubOrder = new Types.ObjectId(id);
      const itemsSubOrder: any = await this.itemsSubOrderModule
        .find({ subOrderId: idSubOrder })
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
  async findById(id: string): Promise<any> {
    try {
      const _id = new Types.ObjectId(id);
      const itemsSubOrder: any = await this.itemsSubOrderModule
        .findOne({ _id: _id })
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
  async update(id: string, updateItemsSubOrderDto: any) {
    try {
      const idItemsSubOrder = new Types.ObjectId(id);
      const itemsSubOrder = await this.itemsSubOrderModule.updateOne(
        { _id: idItemsSubOrder },
        updateItemsSubOrderDto,
      );
      if (updateItemsSubOrderDto.voucherShopId) {
        const item = await this.findById(id);
        await this.itemsSubOrderModule.updateOne(
          { _id: item._id },
          { discount: 0, coin: 0 },
        );
        if (item.voucherShopId.type === 'price') {
          const priceDiscount = discountPrice(
            item.total,
            item.voucherShopId.percent,
          );
          if (priceDiscount > item.voucherShopId.maximum_reduction) {
            await this.itemsSubOrderModule.updateOne(
              { _id: item._id },
              { discount: item.voucherShopId.maximum_reduction },
            );
          } else {
            await this.itemsSubOrderModule.updateOne(
              { _id: item._id },
              { discount: priceDiscount },
            );
          }
        } else {
          const coinRefunt = discountPrice(
            item.total,
            item.voucherShopId.percent,
          );
          if (coinRefunt > item.voucherShopId.maximum_reduction) {
            await this.itemsSubOrderModule.updateOne(
              { _id: item._id },
              { coin: item.voucherShopId.maximum_reduction },
            );
          } else {
            await this.itemsSubOrderModule.updateOne(
              { _id: item._id },
              { coin: coinRefunt },
            );
          }
        }
      }
      return itemsSubOrder;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} itemsSubOrder`;
  }
  async removeByIdSubOrder(id: string) {
    try {
      const idSubOrder = new Types.ObjectId(id);
      return this.itemsSubOrderModule.deleteMany({ subOrderId: idSubOrder });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
export function totalPriceOfArray(arr: any) {
  return arr.reduce((acc: number, item: any) => {
    if (item.discountDetailId) {
      const price =
        (item.productPriceId.price *
          item.quantity *
          (100 - item.discountDetailId.percent)) /
        100;
      return acc + price;
    } else {
      const price = item.productPriceId.price * item.quantity;
      return acc + price;
    }
  }, 0);
}
export function discountPrice(price: number, percent: number) {
  return (price * percent) / 100;
}
