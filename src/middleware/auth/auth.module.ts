import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CustomerModule } from 'src/controller/customer/customer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherWalletSchemas } from 'src/controller/voucher-wallet/schemas/voucher-wallet.schemas';

@Module({
  imports: [
    CustomerModule,
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME },
    }),
    MongooseModule.forFeature([
      { name: 'VoucherWallet', schema: VoucherWalletSchemas },
    ]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthModule, AuthService],
})
export class AuthModule {}
