import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './middleware/auth/auth.module';
import { CustomerModule } from './controller/customer/customer.module';
import { ProductModule } from './controller/product/product.module';
import { ShopModule } from './controller/seller/shop/shop.module';
import { IdentificationModule } from './controller/seller/identification/identification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGGO_URL),
    AuthModule,
    CustomerModule,
    ShopModule,
    ProductModule,
    IdentificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
