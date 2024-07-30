import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import {
  CreateFlashSaleDetailDto,
  CreateFlashSaleDto,
} from './dto/create-flash-sale.dto';
import { UpdateFlashSaleDto } from './dto/update-flash-sale.dto';
import { Public } from 'src/middleware/auth/public';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('flash-sale')
export class FlashSaleController {
  constructor(private readonly flashSaleService: FlashSaleService) {}

  @Post()
  create(@Body() createFlashSaleDto: CreateFlashSaleDto, @Request() res) {
    return this.flashSaleService.create(createFlashSaleDto, res.user);
  }

  @Post('detail')
  createDetail(@Body() createFlashSaleDto: CreateFlashSaleDetailDto[]) {
    return this.flashSaleService.createDetail(createFlashSaleDto);
  }

  @Public()
  @Get('shop/:idShop')
  findByIdShop(@Param('idShop') idShop: string) {
    return this.flashSaleService.findByIDShop(idShop);
  }

  @Public()
  @Get(':idFlashSale')
  findDetailByIdFlashSale(@Param('idFlashSale') idFlashSale: string) {
    return this.flashSaleService.findDetailByIdFlashSale(idFlashSale);
  }

  @Public()
  @Get('time_start')
  findDetailByIdTime(@Body() time_start: { time_start: string }) {
    return this.flashSaleService.findDetailByTime(time_start.time_start);
  }

  @Get()
  findAll() {
    return this.flashSaleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.flashSaleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFlashSaleDto: UpdateFlashSaleDto,
    @Request() req,
  ) {
    return this.flashSaleService.update(id, updateFlashSaleDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.flashSaleService.remove(id, req.user);
  }
}
