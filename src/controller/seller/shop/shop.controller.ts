import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@ApiBearerAuth()
@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Request() req) {
    return this.shopService.create(req.user);
  }

  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Request() req) {
    return this.shopService.findByCustomer(req);
  }

  @UseGuards(AuthGuard)
  @Patch()
  update(@Request() req, @Body() updateShopDto: UpdateShopDto) {
    return this.shopService.update(req.user, updateShopDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopService.remove(+id);
  }
}
