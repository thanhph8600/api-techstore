import { HttpException, Injectable, InternalServerErrorException, Query } from '@nestjs/common';
import { CreateItemsOrderDto } from './dto/create-items-order.dto';
import { UpdateItemsOrderDto } from './dto/update-items-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ItemsOrder } from './schemas/itemsOrder.schema';
import { payload } from '../customer/interface/customer.interface';
import { ShopService } from '../seller/shop/shop.service';
import { ProductPriceService } from '../variation/product-price/product-price.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/Schemas/notification.schema';
import { OrderService } from '../order/order.service';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class ItemsOrderService {
  constructor(
    @InjectModel('ItemsOrder')
    private readonly itemsOrderModel: Model<ItemsOrder>,
    private readonly shopService: ShopService,
    private readonly productPriceService: ProductPriceService,
    private readonly notificationService: NotificationService,
    private readonly walletService: WalletService
  ) { }
  async create(createItemsOrderDto: CreateItemsOrderDto) {
    try {
      const itemsOrder = new this.itemsOrderModel(createItemsOrderDto);
      await this.notificationService.create({
        customerId: createItemsOrderDto.customerId,
        title: `Đặt hàng thành công`,
        content: `Đơn hàng với mã 2TEX${itemsOrder._id.toString().slice(0, 6)} của bạn đã được đặt thành công`,
        type: NotificationType.ORDER,
        orderItemsId: itemsOrder._id.toString(),
      })
      return await itemsOrder.save();
    } catch (error) {
      console.log('error itemsOrder create', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    try {
      return this.itemsOrderModel.find()
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
    } catch (error) {
      console.log('error itemsOrder findAll ', error);
      throw new InternalServerErrorException();
    }
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
  async findByQuery(customerId: string, query: string): Promise<any> {
    try {
      const items: any = await this.itemsOrderModel
        .find({ customerId: customerId })
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
      const listItemQuery = items.filter((item: any) => {
        switch (query) {
          case '0':
            return true;
          case '1':
            return item.status === 'Chờ xác nhận' || item.status === 'Đã xác nhận';
          case '2':
            return item.status === 'Đang vận chuyển';
          case '3':
            return item.status === 'Hoàn thành' || item.statusShipping === 'Đã giao hàng' && item.status !== 'Hoàn hàng';
          case "4":
            return item.status === 'Đã huỷ' || item.statusShipping === 'Giao không thành công'
          case "5":
            return item.status === 'Hoàn hàng';
        }
      });
      const listItemsUnConfirm = items.filter(
        (item: any) => item.status === 'Chờ xác nhận',
      )
      if (listItemsUnConfirm.length > 0) {
        const currentTime = new Date().getTime();
        const itemsToUpdate = listItemsUnConfirm.filter((item: any) => {
          const timeElapsed = currentTime - item.created.getTime();
          return timeElapsed > 259200000;
        });
        for (const item of itemsToUpdate) {
          await this.cancelOrder(item._id);
          await this.notificationService.create({
            customerId: item.customerId._id.toString(),
            type: NotificationType.ORDER,
            title: 'Đơn hàng bị huỷ',
            content: `Đơn hàng ${item._id} bị huỷ, vì không có phản hồi từ shop.`,
            orderItemsId: item._id
          })
          await this.updateStatusTime({ id: item._id, key: 'auto_cancel', value: new Date() });
        }
      }
      return listItemQuery.reverse();
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
      const listItemsUnConfirm = items.filter(
        (item: any) => item.status === 'Chờ xác nhận',
      )
      if (listItemsUnConfirm.length > 0) {
        const currentTime = new Date().getTime();
        const itemsToUpdate = listItemsUnConfirm.filter((item: any) => {
          const timeElapsed = currentTime - item.created.getTime();
          return timeElapsed > 259200000;
        });
        for (const item of itemsToUpdate) {
          await this.cancelOrder(item._id);
          await this.notificationService.create({
            customerId: item.customerId._id.toString(),
            type: NotificationType.ORDER,
            title: 'Đơn hàng bị huỷ',
            content: `Đơn hàng ${item._id} bị huỷ, vì không có phản hồi từ shop.`,
            orderItemsId: item._id
          })
          await this.updateStatusTime({ id: item._id, key: 'auto_cancel', value: new Date() });
        }
      }

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
  async findByShop(payload: payload): Promise<any> {
    try {
      const shop = await this.shopService.create(payload);
      const items: any = await this.itemsOrderModel
        .find({ shopId: String(shop._id) })
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
      return this.handleThumbnailItemOrder(items.reverse());
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  findOne(id: string) {
   try {
    return this.itemsOrderModel.findById(new Types.ObjectId(id)).populate({
      path: 'orderId',
      select: 'methodPayment',
    });
   }
   catch (error) {
    throw new InternalServerErrorException(error);
   }
  }

  async update(id: string, updateItemsOrderDto: UpdateItemsOrderDto) {
    if (updateItemsOrderDto.status === 'Hoàn hàng') {
      await this.updateStatusTime({ id: id, key: 'Hoàn hàng', value: new Date() });
    }
    const update = this.itemsOrderModel.findByIdAndUpdate(id, updateItemsOrderDto);
    return update;
  }

  async cancelOrder(id: string) {
    try {
      const item = await this.itemsOrderModel.findById(id);
      if (item.statusShipping) {
        return new HttpException('Đơn hàng đang được gửi không thể huỷ', 280);
      }
      item.status = 'Đã huỷ';
      await item.save();
      const refundStockPromises = [];
      for (const subItem of item.items) {
        const refundPromise = this.productPriceService.refuntStock(
          subItem.productPriceId.toString(),
          subItem.quantity
        );
        refundStockPromises.push(refundPromise);
      }
      await Promise.all(refundStockPromises);
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async deliveryFailed(id: string) {
    try {
      const item = await this.itemsOrderModel.findById(id)
      .populate({
        path: 'orderId',
        select: 'methodPayment',
      })
      item.statusShipping = 'Giao không thành công';
      if ((item.orderId as any).methodPayment === 'Techtribe Pay') {
        const wallet = await this.walletService.findByIdCustomer(item.customerId.toString());
        await this.walletService.deposit(wallet._id, item.total , `hoàn trả từ đơn hàng 2TEX${item._id.toString().slice(0, 6)} `);
      }
      await item.save();
      await this.cancelOrderByShipping(id);
      await this.updateStatusTime({ id: id, key: 'Giao hàng không thành công', value: new Date() });
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async cancelOrderByShipping (id: string) {
    try {
      const item = await this.itemsOrderModel.findById(id);
      item.status = 'Đã huỷ';
      await item.save();
      const refundStockPromises = [];
      for (const subItem of item.items) {
        const refundPromise = this.productPriceService.refuntStock(
          subItem.productPriceId.toString(),
          subItem.quantity
        );
        refundStockPromises.push(refundPromise);
      }
      await Promise.all(refundStockPromises);
      await this.notificationService.create({
        title: 'Đơn hàng đã bị huỷ',
        content: `Đơn hàng 2TEX${item._id.toString().slice(0, 6)} đã bị huỷ vì không liên hệ được người nhận hàng`,
        type: NotificationType.ORDER,
        customerId: item.customerId.toString(),
        orderItemsId: item.orderId.toString(),
      })
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async refuntOrder(id: string) {
    try {
      const item = await this.itemsOrderModel.findById(id);
      const order = await this.findByIdOrder(item.orderId.toString());
      if (item.statusShipping) {
        return new HttpException('error', 280);
      }
      item.status = 'Hoàn';
      await item.save();
      const refundStockPromises = [];
      for (const subItem of item.items) {
        const refundPromise = this.productPriceService.refuntStock(
          subItem.productPriceId.toString(),
          subItem.quantity
        );
        refundStockPromises.push(refundPromise);
      }
      await Promise.all(refundStockPromises);
      return item;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async updateStatusTime({ id, key, value }: any) {
    try {
      const item = await this.itemsOrderModel.findById(id);
      item.statusUpdate.push({ key: key, value: value });
      if (key === 'Đã giao hàng') {
        await this.notificationService.create({
          customerId: item.customerId.toString(),
          type: NotificationType.ORDER,
          title: 'Giao hàng thành công',
          content: `Shipper đã xác nhận giao đơn hàng cho bạn thành công`,
          orderItemsId: item._id.toString(),
        })
      }

      return await item.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  remove(id: number) {
    return `This action removes a #${id} itemsOrder`;
  }
  async checkDeliveryTime(id: string) {
    try {
      const item = await this.itemsOrderModel.findById(new Types.ObjectId(id));
      return item.DeliveryTime;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  handleThumbnailItemOrder(listOrder) {
    if (listOrder.length > 0) {
      listOrder.map((order) => {
        if (order.customerId && order.customerId.avata) {
          const avata = order.customerId.avata;
          if (!avata.startsWith('http://') && !avata.startsWith('https://')) {
            order.customerId.avata = `${process.env.URL_API}uploads/${avata}`;
          }
        }
        if (order.items && order.items.length > 0) {
          order.items.map((itemPrice) => {
            const thumbnail =
              itemPrice.productPriceId.id_product[0].thumbnails[0];
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
      });
    }
    return listOrder;
  }
}
