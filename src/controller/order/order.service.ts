import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model, Types } from 'mongoose';
import { ItemsOrderService } from '../items-order/items-order.service';
import { ProductPriceService } from '../variation/product-price/product-price.service';
import { SubOrderService } from '../sub-order/sub-order.service';
import { CartService } from '../cart/cart.service';
import { CustomerRewardService } from '../customer-reward/customer-reward.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    private readonly itemsOrderService: ItemsOrderService,
    private readonly productPriceService: ProductPriceService,
    private readonly subOrderService: SubOrderService,
    private readonly cartService: CartService,
    private readonly customerRewardService: CustomerRewardService,
  ) {}
  async create(createOrderDto: CreateOrderDto) {
    try {
      const checkStockPromises = createOrderDto.items.flatMap((item: any) =>
        item.items.map((subItem: any) =>
          this.productPriceService.checkStockIsAvailable(
            subItem.productPriceId._id,
            subItem.quantity,
            createOrderDto.customerId,
          ),
        ),
      );
      const checkStockResults = await Promise.all(checkStockPromises.flat());
      const allInStock = checkStockResults.every((result) => result);
      if (!allInStock) {
        this.subOrderService.remove(createOrderDto.subOrderId);
        return {
          status: 290,
          message: 'Có sản phẩm hiện không khả dụng vui lòng thử lại',
        };
      } else {
        const updateStockPromises = createOrderDto.items.flatMap((item: any) =>
          item.items.map((subItem: any) =>
            this.productPriceService.update(subItem.productPriceId._id, {
              stock: subItem.productPriceId.stock - subItem.quantity,
            }),
          ),
        );
        await Promise.all(updateStockPromises.flat());
      }
      const newOrder = new this.orderModel(createOrderDto);
      await newOrder.save();
      await this.customerRewardService.minusCoin(
        createOrderDto.customerId,
        createOrderDto.coin,
      );
      const saveItemsOrder = createOrderDto.items.map(async (item: any) => {
        const subTotalListItem = item.items.reduce((acc: number, item: any) => {
          if (item.discountDetailId) {
            return (
              acc +
              (item.productPriceId.price *
                item.quantity *
                (100 - item.discountDetailId.percent)) /
                100
            );
          } else {
            return acc + item.productPriceId.price * item.quantity;
          }
        }, 0);
        if (newOrder.coin > 0) {
          item.coin = newOrder.coin / createOrderDto.items.length;
          item.total = subTotalListItem - item.coin + item.costShipping;
        } else if (item.discount > 0) {
          item.total = subTotalListItem - item.discount + item.costShipping;
        } else if (item.coin > 0 && item.discount > 0) {
          const coin = item.coin / createOrderDto.items.length;
          item.total =
            subTotalListItem - item.discount + item.costShipping - coin;
        } else {
          item.coin = 0;
          item.total = subTotalListItem + item.costShipping;
        }
        await this.itemsOrderService.create({
          customerId: createOrderDto.customerId,
          shopId: item.shopId._id,
          orderId: newOrder._id,
          items: item.items,
          costShipping: item.costShipping,
          total: item.total,
          subTotal: subTotalListItem,
          discount: item.discount,
          coin: item.coin,
          voucherShopId: item.voucherShopId?._id,
        });
      });
      for (const item of createOrderDto.items) {
        for (const subItem of item.items) {
          await this.cartService.removeChildItem(createOrderDto.customerId, {
            productPriceId: subItem.productPriceId._id,
            shopId: item.shopId._id,
          });
        }
      }
      await Promise.all(saveItemsOrder);
      await this.subOrderService.remove(createOrderDto.subOrderId);
      return { status: 200, message: 'Đơn hàng đang được xử lý' };
    } catch (error) {
      console.log('error cartSlecte create', error);
      throw new InternalServerErrorException();
    }
  }
  async findByCustomerId(id: string) {
    try {
      const orders = await this.orderModel
        .find({ customerId: id })
        .populate('customerId')
        .populate('shopId')
        .populate('voucher2t')
        .populate('voucherShipping')
        .exec();
      const ordersWithItems = await Promise.all(
        orders.map(async (order: any) => {
          const items = await this.itemsOrderService.findByIdOrder(order._id);
          return {
            ...order.toObject(),
            items: items,
          };
        }),
      );

      return ordersWithItems;
    } catch (error) {
      console.log('error cartSlecte create', error);
      throw new InternalServerErrorException();
    }
  }
  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    console.log(updateOrderDto);
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    try {
      return this.orderModel.deleteOne({ _id: new Types.ObjectId(id) });
    } catch (error) {
      console.log('error cartSlecte remove', error);
      throw new InternalServerErrorException();
    }
  }
}
