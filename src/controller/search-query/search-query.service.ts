    import { Injectable } from '@nestjs/common';
    import { ProductService } from '../product/product.service';
    import { ShopService } from '../seller/shop/shop.service';
import { CategoryService } from '../category/category.service';

    @Injectable()
    export class SearchQueryService {
        constructor(
            private readonly productService: ProductService , 
            private readonly shopService : ShopService ,
            private readonly categoryService: CategoryService
        ) {}

        async searchQuery(query: string) {
            const productQuery = await this.productService.search(query);
            const shopQuery = await this.shopService.search(query);
            const categoryQuery = await this.categoryService.search(query);
            const combinedResults = [...categoryQuery,...productQuery, ...shopQuery];
            return combinedResults.slice(0, 6);
        }

    }
