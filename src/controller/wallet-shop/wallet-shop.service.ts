import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WalletShop } from './schemas/walletShop.schema';
import { Model } from 'mongoose';
import { payload } from '../customer/interface/customer.interface';
import { ShopService } from '../seller/shop/shop.service';
import { NotificationService } from '../notification/notification.service';
import { fortmatNumberToVnd } from '../wallet/wallet.service';
import { NotificationType } from '../notification/Schemas/notification.schema';
import { WalletShopTransactionsService } from '../wallet-shop-transactions/wallet-shop-transactions.service';

@Injectable()
export class WalletShopService {
  constructor(
    @InjectModel(WalletShop.name)
    private readonly walletShopModel: Model<WalletShop>,
    private readonly shopService: ShopService,
    private readonly walletShopTransactionService: WalletShopTransactionsService,
    private readonly notificationService: NotificationService,
  ) {}
  async create(payload: payload) {
    try {
      const shop = await this.shopService.create(payload);
      const wallet = await this.walletShopModel.findOne({
        id_shop: String(shop._id),
      });
      if (wallet) {
        return wallet;
      }
      const create = {
        id_shop: String(shop._id),
        balance: 0,
      };
      const newWallet = await this.walletShopModel.create(create);
      return newWallet;
    } catch (error) {
      console.log('errr create walletShop');
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findByShop(payload: payload) {
    const check = await this.create(payload);
    const wallet = await this.walletShopModel
      .findById(check._id)
      .populate({
        path: 'wallet_transaction',
        options: {
          sort: { _id: -1 },
        },
      })
      .lean()
      .exec();
    return wallet;
  }

  async handleWalletShop(amount: number, id_shop: string, id_order: string) {
    if (amount < 0 || typeof amount !== 'number')
      return new HttpException(
        'amount có kiểu dữ là number',
        HttpStatus.BAD_REQUEST,
      );
    try {
      const shop = await this.shopService.findById(id_shop);
      let wallet = await this.walletShopModel.findOne({ id_shop });
      if (!wallet) {
        const create = {
          id_shop,
          balance: 0,
        };
        wallet = await this.walletShopModel.create(create);
      }
      const update = this.sendNotification(
        'deposit',
        amount,
        wallet,
        shop.id_customer[0]._id.toString(),
        id_order,
      );
      return update;
    } catch (error) {
      console.log('errr walletShop depositOrder');
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async withdrawWalletShop(amount: number, payload: payload) {
    if (!amount) {
      return new HttpException('amount not empty!', HttpStatus.CONFLICT);
    }
    const wallet = await this.create(payload);
    if (wallet.balance - amount < 0) {
      return new HttpException(
        'Số tiền còn lại trong ví không đủ!',
        HttpStatus.CONFLICT,
      );
    }
    const update = this.sendNotification(
      'withdraw',
      amount,
      wallet,
      payload.sub,
    );
    return update;
  }

  async sendNotification(
    type: 'withdraw' | 'deposit',
    amount: number,
    wallet,
    customerId: string,
    id_order?: string,
  ) {
    const dataWalletTran = {
      walletId: String(wallet._id),
      amount,
      type,
      description: `Rút tiền về tài khoản`,
    };

    let balance = wallet.balance - amount;
    const createNotification = {
      customerId,
      title: 'Biến động số dư',
      content:
        `-${fortmatNumberToVnd(amount)} cho ` +
        dataWalletTran.description +
        ` số dư còn lại là: ${fortmatNumberToVnd(balance)}`,
      type: NotificationType.WALLET,
    };
    if (type === 'deposit') {
      balance = wallet.balance + amount;
      dataWalletTran.description = `Danh thu từ đơn hàng #${id_order.toUpperCase()}`;
      createNotification.content = `+${fortmatNumberToVnd(amount)} cho ${dataWalletTran.description} số dư còn lại là: ${fortmatNumberToVnd(balance)}`;
    }
    await this.walletShopTransactionService.create(dataWalletTran);
    const update = await this.update(String(wallet._id), balance);
    await this.notificationService.create(createNotification);
    return update;
  }

  async update(id: string, balance: number) {
    try {
      const update = this.walletShopModel.findByIdAndUpdate(id, { balance });
      return update;
    } catch (error) {
      console.log('errr update walletShop');
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
