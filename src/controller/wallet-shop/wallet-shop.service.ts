import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WalletShop } from './schemas/walletShop.schema';
import { Model } from 'mongoose';
import { payload } from '../customer/interface/customer.interface';
import { ShopService } from '../seller/shop/shop.service';
import { WalletTransactionsService } from '../wallet-transactions/wallet-transactions.service';
import { NotificationService } from '../notification/notification.service';
import { fortmatNumberToVnd } from '../wallet/wallet.service';
import { NotificationType } from '../notification/Schemas/notification.schema';

@Injectable()
export class WalletShopService {
  constructor(
    @InjectModel(WalletShop.name)
    private readonly walletShopModel: Model<WalletShop>,
    private readonly shopService: ShopService,
    private readonly walletTransactionService: WalletTransactionsService,
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

  async depositOrder(amount: number, id_shop: string, id_order: string) {
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
      const dataWalletTran = {
        walletId: String(wallet._id),
        amount,
        type: 'deposit',
        description: `Danh thu từ đơn hàng #${id_order.toUpperCase()}`,
      };
      const createTran =
        await this.walletTransactionService.create(dataWalletTran);
      const balance = wallet.balance + amount;
      await this.update(String(wallet._id), balance);
      await this.notificationService.create({
        customerId: shop.id_customer[0]._id.toString(),
        title: 'Biến động số dư',
        content:
          `+${fortmatNumberToVnd(amount)} cho ` +
          dataWalletTran.description +
          ` số dư còn lại là: ${fortmatNumberToVnd(balance)}`,
        type: NotificationType.WALLET,
      });
      return createTran;
    } catch (error) {
      console.log('errr walletShop depositOrder');
      console.log(error);
      throw new InternalServerErrorException(error);
    }
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
