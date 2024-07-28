import { Injectable } from '@nestjs/common';
import { CategoryDetailService } from '../category-detail/category-detail.service';

    @Injectable()
    export class SearchQueryService {
        constructor(
            private readonly categoryDetailService: CategoryDetailService
        ) {}

        async searchQuery(query: string) {
            const categoryQuery = await this.categoryDetailService.search(query);
            const combinedResults = [...categoryQuery];
            return combinedResults.slice(0, 6);
        }

    }
