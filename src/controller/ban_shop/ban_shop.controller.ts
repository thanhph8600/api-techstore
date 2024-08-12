import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, HttpException, HttpStatus, Put, BadRequestException } from '@nestjs/common';
import { BanShopService } from './ban_shop.service';
import { CreateBanShopDto } from './dto/create-ban_shop.dto';
import { UpdateBanShopDto } from './dto/update-ban_shop.dto';
import { Public } from 'src/middleware/auth/public';
import { ApiTags } from '@nestjs/swagger';
import { BanShop } from './schemas/ban_shop.schemas';

@Controller('ban-shop')
@ApiTags('ban-shop')
export class BanShopController {
  constructor(private readonly banShopService: BanShopService) {}

  @Public()
  @Post()
  async create(@Body() createBanShopDto: CreateBanShopDto) {
    return this.banShopService.create(createBanShopDto);
  }

  @Public()
  @Get()
  async findAll() {
    return this.banShopService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.banShopService.findOne(+id);
  // }

  @Public()
  @Put(':id_shop')
  async update(
    @Param('id_shop') id_shop: string, 
    @Body() updateBanShopDto: UpdateBanShopDto
  ): Promise<HttpException | BanShop> {
    const updatedBanShop = await this.banShopService.updateByIdShop(id_shop, updateBanShopDto);
    
    if (!updatedBanShop) {
      throw new NotFoundException(`Shop với địa chỉ ${id_shop} không tồn tại`);
    }
    
    return new HttpException('Sửa cấm cửa hàng thành công', HttpStatus.CREATED);
  }

  @Public()
  @Get(':id_shop')
  async findByIdShop(@Param('id_shop') id_shop: string){
    const shop = await this.banShopService.findByIdShop(id_shop);
    
    if (!shop) {
      throw new NotFoundException(`Shop với id_shop ${id_shop} không tồn tại`);
    }
    return shop;
  }

  @Public()
  @Get('check-ban/:id_shop')
  async checkBanStatus(@Param('id_shop') id_shop: string) {
    const {isBanned, remainingBanTime} = await this.banShopService.checkIfShopIsBanned(id_shop)

    if(!isBanned) {
      return { message: 'Shop is not banned', isBanned };
    }else {
      return {isBanned, remainingBanTime}
    }
    // if (isBanned) {
    //   throw new BadRequestException(`Shop is banned ${isBanned} for ${remainingBanTime} milliseconds`);
    //   return {isBanned, remainingBanTime}
    // }

  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.banShopService.remove(+id);
  }
}
