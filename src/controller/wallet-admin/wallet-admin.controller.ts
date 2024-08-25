import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletAdminService } from './wallet-admin.service';
import { CreateWalletAdminDto } from './dto/create-wallet-admin.dto';
import { UpdateWalletAdminDto } from './dto/update-wallet-admin.dto';

@Controller('wallet-admin')
export class WalletAdminController {
  constructor(private readonly walletAdminService: WalletAdminService) {}

  @Post()
  create(@Body() createWalletAdminDto: CreateWalletAdminDto) {
    return this.walletAdminService.create(createWalletAdminDto);
  }

  @Get()
  findAll() {
    return this.walletAdminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletAdminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWalletAdminDto: UpdateWalletAdminDto) {
    return this.walletAdminService.update(+id, updateWalletAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walletAdminService.remove(+id);
  }
}
