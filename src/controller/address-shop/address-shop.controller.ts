import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AddressShopService } from './address-shop.service';
import { CreateAddressShopDto } from './dto/create-address-shop.dto';
import { UpdateAddressShopDto } from './dto/update-address-shop.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { Public } from 'src/middleware/auth/public';

@Controller('address-shop')
export class AddressShopController {
  constructor(private readonly addressShopService: AddressShopService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() create: CreateAddressShopDto, @Request() req) {
    return this.addressShopService.create(create, req.user);
  }

  @Public()
  @Get(':id')
  findByIdShop(@Param('id') id: string) {
    return this.addressShopService.findByIdShop(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() update: UpdateAddressShopDto,
  ) {
    return this.addressShopService.update(id, update, req.user);
  }
}
