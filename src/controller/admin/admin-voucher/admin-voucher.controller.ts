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
  HttpException,
} from '@nestjs/common';
import { AdminVoucherService } from './admin-voucher.service';
import { CreateAdminVoucherDto } from './dto/create-admin-voucher.dto';
import { UpdateAdminVoucherDto } from './dto/update-admin-voucher.dto';
import { AuthGuard } from 'src/middleware/auth/auth.guard';
import { Public } from 'src/middleware/auth/public';
import { ObjectId, Types } from 'mongoose';

@Controller('admin-voucher')
export class AdminVoucherController {
  constructor(private readonly adminVoucherService: AdminVoucherService) {}

  @UseGuards(AuthGuard)
  @Post('')
  async create(
    @Body() createDto: CreateAdminVoucherDto,
    @Request() req,
  ): Promise<HttpException> {
    return this.adminVoucherService.createAdminVoucher(createDto, req.user);
  }

  @Public()
  @Get()
  findAll() {
    return this.adminVoucherService.findAll();
  }

  @Public()
  @Get('getbycode/:code/:id_customer')
  async findByCode(
    @Param('code') code: string,
    @Param('id_customer') id_customer: string,
  ) {
    const id_customerToObjectId = new Types.ObjectId(id_customer);
    return this.adminVoucherService.findOneByCode(code, id_customerToObjectId);
  }

  @Public()
  @Get('getbyid/:id')
  async findOneById(@Param('id') id: string) {
    return await this.adminVoucherService.findOneById(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAdminVoucherDto: UpdateAdminVoucherDto,
  ) {
    return this.adminVoucherService.update(+id, updateAdminVoucherDto);
  }

  @Public()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.adminVoucherService.remove(id);
  }
}
