import { Controller, Get, Query } from '@nestjs/common';
import { SearchQueryService } from './search-query.service';
import { Public } from 'src/middleware/auth/public';

@Controller('search-query')
export class SearchQueryController {
  constructor(private readonly searchQueryService: SearchQueryService) {}

  @Public()
  @Get()
  async search(@Query('q') query: string) {
    return this.searchQueryService.searchQuery(query);
  }

}
