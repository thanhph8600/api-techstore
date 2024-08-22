import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CardLinkService } from './card-link.service';
import { CreateCardLinkDto } from './dto/create-card-link.dto';
import { UpdateCardLinkDto } from './dto/update-card-link.dto';

@Controller('card-link')
export class CardLinkController {
  constructor(private readonly cardLinkService: CardLinkService) {}

  @Post()
  create(@Body() createCardLinkDto: CreateCardLinkDto) {
    return this.cardLinkService.create(createCardLinkDto);
  }

  @Get()
  findAll() {
    return this.cardLinkService.findAll();
  }

  @Get('wallet/:id')
  findByWallet(@Param('id') id: string) {
    return this.cardLinkService.findByIdWallet(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cardLinkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCardLinkDto: UpdateCardLinkDto) {
    return this.cardLinkService.update(+id, updateCardLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardLinkService.remove(+id);
  }
}
