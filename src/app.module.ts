import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './middleware/auth/auth.module';
import { CustomerModule } from './controller/customer/customer.module';
import { ProductModule } from './controller/product/product.module';
import { ShopModule } from './controller/seller/shop/shop.module';
import { IdentificationModule } from './controller/seller/identification/identification.module';
import { CategoryModule } from './controller/category/category.module';
import { CategoryDetailModule } from './controller/category-detail/category-detail.module';
import { BrandModule } from './controller/brand/brand.module';
import { SpecificationModule } from './controller/specification/main/specification.module';
import { ProductPriceModule } from './controller/variation/product-price/product-price.module';
import { UploadModule } from './middleware/upload/upload.module';
import mongoose from 'mongoose';
import { CartModule } from './controller/cart/cart.module';
import { DiscountModule } from './controller/marketing/discount/discount.module';
import { VoucherModule } from './controller/marketing/voucher/voucher.module';
import { AddressModule } from './controller/address/address.module';
import { FlashSaleModule } from './controller/marketing/flash-sale/flash-sale.module';
import { WebSocketModule } from './web-socket/web-socket.module';
import { RoomChatModule } from './controller/chat/room-chat/room-chat.module';
import { MessengerModule } from './controller/chat/messenger/messenger.module';
import { BanShopModule } from './controller/ban_shop/ban_shop.module';
import { ItemsSubOrderModule } from './controller/items-sub-order/items-sub-order.module';
import { ItemsOrderModule } from './controller/items-order/items-order.module';
import { ProductReviewModule } from './controller/product-review/product-review.module';
import { AutoReplyModule } from './controller/chat/auto-reply/auto-reply.module';
import { MessageShortCutModule } from './controller/chat/message-short-cut/message-short-cut.module';
import { OrderModule } from './controller/order/order.module';
import { AdminVoucherModule } from './controller/admin/admin-voucher/admin-voucher.module';
import { VoucherWalletModule } from './controller/voucher-wallet/voucher-wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGGO_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CustomerModule,
    ShopModule,
    ProductModule,
    IdentificationModule,
    CategoryModule,
    CategoryDetailModule,
    BrandModule,
    SpecificationModule,
    CartModule,
    ProductPriceModule,
    UploadModule,
    DiscountModule,
    VoucherModule,
    AddressModule,
    FlashSaleModule,
    WebSocketModule,
    RoomChatModule,
    MessengerModule,
    ItemsSubOrderModule,
    OrderModule,
    ItemsOrderModule,
    ProductReviewModule,
    AutoReplyModule,
    MessageShortCutModule,
    BanShopModule,
    AdminVoucherModule,
    OrderModule,
    VoucherWalletModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  onModuleInit() {
    mongoose.set('strictPopulate', false);
    console.log('Connected to MongoDB');
  }
}
