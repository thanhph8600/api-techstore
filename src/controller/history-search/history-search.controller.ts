import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HistorySearchService } from './history-search.service';
import { CreateHistorySearchDto } from './dto/create-history-search.dto';
import { UpdateHistorySearchDto } from './dto/update-history-search.dto';

@Controller('history-search')
export class HistorySearchController {
  constructor(private readonly historySearchService: HistorySearchService) {}

  @Post()
  create(@Body() createHistorySearchDto: CreateHistorySearchDto) {
    return this.historySearchService.create(createHistorySearchDto);
  }

  @Get()
  findAll() {
    return this.historySearchService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.historySearchService.findOne(id);
  }
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHistorySearchDto: UpdateHistorySearchDto) {
    return this.historySearchService.update(id, updateHistorySearchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.historySearchService.remove(+id);
  }
}
