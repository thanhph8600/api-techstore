import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AnalysisShopService } from './analysis-shop.service';
import { AuthGuard } from 'src/middleware/auth/auth.guard';

@Controller('analysis-shop')
export class AnalysisShopController {
  constructor(private readonly analysisShopService: AnalysisShopService) {}

  @UseGuards(AuthGuard)
  @Get()
  findAllByShop(
    @Request() req,
    @Query('start-day') start_day: string,
    @Query('end-day') end_day: string,
    @Query('year') year: string,
  ) {
    return this.analysisShopService.findAllByShop(
      req.user,
      start_day,
      end_day,
      year,
    );
  }
}
