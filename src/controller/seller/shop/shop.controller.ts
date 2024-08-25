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
  Query,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { UpdateShopDto } from './dto/update-shop.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { Public } from 'src/middleware/auth/public';

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

  @Public()
  @Get()
  findAll() {
    return this.shopService.findAll();
  }

  @Public()
  @Get('count-shop')
  countShop() {
    return this.shopService.countShop();
  }


  @Public()
  @Get('store/:id')
  findById(@Param('id') id: string) {
    return this.shopService.findById(id);
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


  // thống kê

  @Public()
  @Post('add-createdAt')
  async addCreatedAtToExistingShops(): Promise<string> {
    await this.shopService.addCreatedAtToExistingShops();
    return 'Added createdAt to all existing Shops';
  }

  @Patch('update-createdAt')
  async updateShopCreatedAt(
    @Body('id') id: string,
    @Body('createdAt') createdAt: string,
  ): Promise<string> {
    const newCreatedAt = new Date(createdAt);
    await this.shopService.updateCreatedAtById(id, newCreatedAt);
    return `Shop ${id} updated with new createdAt: ${newCreatedAt.toISOString()}`;
  }

  @Public()
  @Get('count/month')
  async countShopsInMonth(
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<number> {
    return this.shopService.countShopsCreatedInMonth(year, month);
  }
}
