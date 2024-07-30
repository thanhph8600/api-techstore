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
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { UpdateDiscountDto } from './dto/update-discount.dto';
import { Public } from 'src/middleware/auth/public';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('discount')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDiscountDto: CreateDiscountDto[], @Request() req) {
    return this.discountService.create(createDiscountDto, req.user);
  }

  @Public()
  @Get()
  findAll() {
    return this.discountService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('shop/123')
  findByIdShop(@Request() req) {
    return this.discountService.findByIdShop(req.user);
  }

  @Public()
  @Get(':id')
  findByIdDiscount(@Param('id') id: string) {
    return this.discountService.findByIdDiscount(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscountDto: UpdateDiscountDto,
    @Request() req,
  ) {
    return this.discountService.update(id, updateDiscountDto, req.user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.discountService.remove(id, req.user);
  }
}
