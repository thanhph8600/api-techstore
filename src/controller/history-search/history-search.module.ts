import { Module } from '@nestjs/common';
import { HistorySearchService } from './history-search.service';
import { HistorySearchController } from './history-search.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorySearch, HistorySearchSchema } from './schemas/history-search.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorySearch.name, schema: HistorySearchSchema },
    ])
  ],
  controllers: [HistorySearchController],
  providers: [HistorySearchService],
})
export class HistorySearchModule {}
