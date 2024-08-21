import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateItemsOrderDto } from './dto/create-items-order.dto';
import { UpdateItemsOrderDto } from './dto/update-items-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItemsOrder } from './schemas/itemsOrder.schema';
import { payload } from '../customer/interface/customer.interface';
import { ShopService } from '../seller/shop/shop.service';

@Injectable()
export class ItemsOrderService {
  constructor(
    @InjectModel('ItemsOrder')
    private readonly itemsOrderModel: Model<ItemsOrder>,
    private readonly shopService: ShopService,
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
        .populate({
          path: 'customerId',
          select: '_id name phone avata',
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
        .lean()
        .exec();
      return this.handleThumbnailOrder(item);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByShop(payload: payload): Promise<any> {
    try {
      const shop = await this.shopService.create(payload);
      const check = await this.itemsOrderModel
        .find({
          shopId: String(shop._id),
        })
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
        .lean()
        .exec();
      return this.handleThumbnailListOrder(check.reverse());
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} itemsOrder`;
  }

  update(id: string, updateItemsOrderDto: UpdateItemsOrderDto) {
    const update = this.itemsOrderModel.findByIdAndUpdate(
      id,
      updateItemsOrderDto,
    );
    return update;
  }

  async updateStatusTime({ id, key, value }: any) {
    try {
      const item = await this.itemsOrderModel.findById(id);
      item.statusUpdate.push({ key: key, value: value });
      return await item.save();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateStatusOrder(id: string, payload: payload, status: string) {
    try {
      const order = await this.itemsOrderModel.findById(id);
      const shop = await this.shopService.create(payload);
      if (
        status === 'Xác nhận' &&
        order.status === 'Chờ xác nhận' &&
        String(shop._id) === String(order.shopId)
      ) {
        return this.updateOrder(order, id, status);
      } else if (
        status === 'Đang vận chuyển' &&
        order.status === 'Xác nhận' &&
        String(shop._id) === String(order.shopId)
      ) {
        return this.updateOrder(order, id, status, 'Đã gửi hàng');
      }
      return new HttpException(
        'Bạn không thể cập nhật đơn hàng!',
        HttpStatus.CONFLICT,
      );
    } catch (error) {
      console.log('error update status order');
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async updateOrder(
    order,
    id: string,
    status: string,
    statusShipping?: string,
  ) {
    try {
      const dataUpdateTime = {
        id: id,
        key: statusShipping || status,
        value: new Date(),
      };
      order.statusUpdate.push(dataUpdateTime);
      if (statusShipping) order.statusShipping = statusShipping;
      order.status = status;
      await this.itemsOrderModel.findByIdAndUpdate(id, order);
      return new HttpException(
        'Cập nhật tình trạng đơn hàng thành công!',
        HttpStatus.CREATED,
      );
    } catch (error) {
      console.log('error update status order');
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} itemsOrder`;
  }
  handleThumbnailListOrder(listOrder) {
    if (listOrder.length > 0) {
      listOrder.map((order) => {
        return this.handleThumbnailOrder(order);
      });
    }
    return listOrder;
  }
  handleThumbnailOrder(order) {
    if (order.customerId && order.customerId.avata) {
      const avata = order.customerId.avata;
      if (!avata.startsWith('http://') && !avata.startsWith('https://')) {
        order.customerId.avata = `${process.env.URL_API}uploads/${avata}`;
      }
    }
    if (order.items && order.items.length > 0) {
      order.items.map((itemPrice) => {
        const thumbnail = itemPrice.productPriceId.id_product[0].thumbnails[0];
        if (
          !thumbnail.startsWith('http://') &&
          !thumbnail.startsWith('https://')
        ) {
          itemPrice.productPriceId.id_product[0].thumbnails[0] = `${process.env.URL_API}uploads/${thumbnail}`;
        }
        return itemPrice;
      });
    }
    return {
      ...order,
    };
  }
}
