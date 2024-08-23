import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { WalletShopService } from './wallet-shop.service';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('wallet-shop')
export class WalletShopController {
  constructor(private readonly walletShopService: WalletShopService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req) {
    return this.walletShopService.create(req.user);
  }
}
