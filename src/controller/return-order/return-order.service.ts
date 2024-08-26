import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReturnOrderDto } from './dto/create-return-order.dto';
import { UpdateReturnOrderDto } from './dto/update-return-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReturnOrder } from './schemas/return-order.schema';
import { ItemsOrderService } from '../items-order/items-order.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/Schemas/notification.schema';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class ReturnOrderService {
  constructor(
    @InjectModel('ReturnOrder') private returnOrderModel: Model<ReturnOrder>,
    private readonly itemsOrderService: ItemsOrderService,
    private readonly notificationService: NotificationService,
    private readonly walletService: WalletService
  ) { }
  async create(createReturnOrderDto: CreateReturnOrderDto) {
    const checkDeliveryTime = this.itemsOrderService.checkDeliveryTime(createReturnOrderDto.itemsOrderId.toString());
    if (!checkDeliveryTime) {
      throw new HttpException('Không thể hoàn trả sản phẩm', HttpStatus.BAD_REQUEST);
    }
    const newReturnOrder = await this.returnOrderModel.create(createReturnOrderDto);
    await this.itemsOrderService.refuntOrder(createReturnOrderDto.itemsOrderId.toString(), newReturnOrder._id.toString());
    await this.notificationService.create({
      customerId: createReturnOrderDto.customerId.toString(),
      title: "Hoàn trả sản phẩm",
      content: `Đã gửi yêu cầu hoàn trả cho đơn hàng 2TEX${createReturnOrderDto.itemsOrderId.toString().slice(0, 6)}`,
      type: NotificationType.ORDER,
      orderItemsId: createReturnOrderDto.itemsOrderId.toString()
    })
    return newReturnOrder;
  }

  findAll() {
    try {
      const listReturnOrder = this.returnOrderModel.find()
      .populate({
        path: 'customerId',
        select: 'name phone avata',
      })
      .populate('shopId')
      .populate({
        path: 'itemsReturn.productPriceId',
        select: 'id_color id_product id_size price stock',
        populate: [
          {
            path: 'id_color',
            select: 'value thumbnail',
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
      .populate('itemsReturn.discountDetailId')
      .populate({
        path: 'itemsOrderId',
        select: 'orderId',
        populate: {
          path: 'orderId',
          select: 'address shippingMethod paymentMethod',
          populate: {
            path: 'address',
          }
        }
      })
      .exec();
      return listReturnOrder;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findOneByItemsOrderId(itemsOrderId: string) {
    const returnOrder = await this.returnOrderModel.findOne({
      itemsOrderId: itemsOrderId
    })
    .populate({
      path: 'customerId',
      select: 'name phone avata',
    })
    .populate('shopId')
    .populate({
      path: 'itemsReturn.productPriceId',
      select: 'id_color id_product id_size price stock',
      populate: [
        {
          path: 'id_color',
          select: 'value thumbnail',
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
    .populate('itemsReturn.discountDetailId')
    .populate('itemsOrderId')
    .sort({ time_created: -1 })
    .exec();
    if(returnOrder?.status === 'Đã gửi hàng lại'){
      const now = new Date().getTime();
      const timeReturnItem = returnOrder.statusUpdate.find((item) => item.key === 'Đã gửi hàng lại').value.getTime();
      if(now - timeReturnItem < 86400000){
        returnOrder.status = 'Hoàn tiền';
        returnOrder.statusUpdate.push({ key: 'Hoàn tiền', value: new Date() });
        const total = returnOrder.itemsReturn.reduce((total, item) => total + item.refundAmount, 0);
        const wallet = await this.walletService.findByIdCustomer(returnOrder.customerId._id.toString());
        await this.walletService.deposit(wallet._id, total, `Hoàn tiền đơn hàng 2TEX${returnOrder.itemsOrderId._id.toString().slice(0, 6)}`);
        await this.notificationService.create({
          customerId: returnOrder.customerId._id.toString(),
          title: "Trả hàng hoàn tiền",
          content: `Yêu cầu hoàn tiền đơn hàng 2TEX${returnOrder.itemsOrderId._id.toString().slice(0, 6)} đã được chấp nhận`,
          type: NotificationType.ORDER,
          orderItemsId: returnOrder.itemsOrderId._id.toString()
        })
        await returnOrder.save();
      }
    }
    return returnOrder;
  }
  findOne(id: number) {
    return `This action returns a #${id} returnOrder`;
  }

 async update(id: string, updateReturnOrderDto: UpdateReturnOrderDto) {
  try {
    if(updateReturnOrderDto.status){
      await this.updateStatusTime({ id: id, key: updateReturnOrderDto.status, value: new Date() });
    }
    return this.returnOrderModel.updateOne({ _id: id }, updateReturnOrderDto);
  }
  catch (error) {
    throw new InternalServerErrorException(error);
  }
   
  }
  async updateStatusTime({ id, key, value }: any) {
    try {
      const item = await this.returnOrderModel.findById(id);
      item.statusUpdate.push({ key: key, value: value });
      return await item.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  remove(id: number) {
    return `This action removes a #${id} returnOrder`;
  }
}
