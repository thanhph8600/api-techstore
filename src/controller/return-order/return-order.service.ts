import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateReturnOrderDto } from './dto/create-return-order.dto';
import { UpdateReturnOrderDto } from './dto/update-return-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReturnOrder } from './schemas/return-order.schema';
import { ItemsOrderService } from '../items-order/items-order.service';
import { NotificationService } from '../notification/notification.service';
import { NotificationType } from '../notification/Schemas/notification.schema';

@Injectable()
export class ReturnOrderService {
  constructor(
    @InjectModel('ReturnOrder') private returnOrderModel: Model<ReturnOrder>,
    private readonly itemsOrderService: ItemsOrderService,
    private readonly notificationService: NotificationService
  ) { }
  async create(createReturnOrderDto: CreateReturnOrderDto) {
    const checkDeliveryTime = this.itemsOrderService.checkDeliveryTime(createReturnOrderDto.itemsOrderId.toString());
    if (!checkDeliveryTime) {
      throw new HttpException('Không thể hoàn trả sản phẩm', HttpStatus.BAD_REQUEST);
    }
    await this.itemsOrderService.update(createReturnOrderDto.itemsOrderId.toString(), { status: "Hoàn hàng" });
    await this.notificationService.create({
      customerId: createReturnOrderDto.customerId.toString(),
      title: "Hoàn trả sản phẩm",
      content: `Đã gửi yêu cầu hoàn trả cho đơn hàng 2TEX${createReturnOrderDto.itemsOrderId.toString().slice(0, 6)}`,
      type: NotificationType.ORDER,
      orderItemsId: createReturnOrderDto.itemsOrderId.toString()
    })

    return this.returnOrderModel.create(createReturnOrderDto);
  }

  findAll() {
    return `This action returns all returnOrder`;
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
    .populate('itemsReturn.discountDetailId')
    .populate('itemsOrderId')
    .exec();
    return returnOrder;
  }
  findOne(id: number) {
    return `This action returns a #${id} returnOrder`;
  }

  update(id: string, updateReturnOrderDto: UpdateReturnOrderDto) {
    return this.returnOrderModel.updateOne({ _id: id }, updateReturnOrderDto);
  }
  async updateStatusTime({ id, key, value }: any) {
    try {
      const item = await this.returnOrderModel.findById(id);
      item.statusUpdate.push({ key: key, value: value });
      if(key === 'Đã giao hàng'){
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
    return `This action removes a #${id} returnOrder`;
  }
}
