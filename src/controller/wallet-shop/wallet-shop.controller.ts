import {
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Body,
  Patch,
} from '@nestjs/common';
import { WalletShopService } from './wallet-shop.service';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('wallet-shop')
export class WalletShopController {
  constructor(private readonly walletShopService: WalletShopService) {}
  @UseGuards(AuthGuard)
  @Get()
  findbyShop(@Request() req) {
    return this.walletShopService.findByShop(req.user);
  }

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req) {
    return this.walletShopService.create(req.user);
  }

  @UseGuards(AuthGuard)
  @Patch()
  whitraw(@Body() body: { amount: string }, @Request() req) {
    return this.walletShopService.withdrawWalletShop(
      Number(body.amount),
      req.user,
    );
  }
}
