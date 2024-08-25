import { Injectable } from '@nestjs/common';
import { payload } from '../customer/interface/customer.interface';
import { ShopService } from '../seller/shop/shop.service';
import { ItemsOrderService } from '../items-order/items-order.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class AnalysisShopService {
  constructor(
    private readonly shopService: ShopService,
    private readonly itemOrderSerivice: ItemsOrderService,
    private readonly productSerivice: ProductService,
  ) {}

  async findAllByShop(
    payload: payload,
    startDate?: string,
    endDate?: string,
    year?: string,
  ) {
    const analysis: {
      [key: string]: {
        sales: number;
        countOrder: number;
        viewProduct: number;
        viewShop: number;
      };
    } = {};
    const productMap: { [key: string]: { product: any; quantity: number } } =
      {};

    // Tìm kiếm thông tin shop
    const checkShop = await this.shopService.create(payload);
    const shop = await this.shopService.findById(String(checkShop._id));

    // Lấy danh sách sản phẩm và đơn hàng của shop
    const listProduct = await this.productSerivice.findByIdShop(
      String(shop._id),
    );
    const listOrder = await this.itemOrderSerivice.findByShop(payload);

    // Lọc các đơn hàng hoàn thành
    const complatedOrder = listOrder.filter(
      (order) => order.status === 'Hoàn thành',
    );

    // Thiết lập khoảng thời gian lọc
    let filterStartDate: Date;
    let filterEndDate: Date;

    if (startDate && endDate) {
      filterStartDate = new Date(startDate);
      filterEndDate = new Date(endDate);
    } else if (year) {
      filterStartDate = new Date(`${year}-01-01`);
      filterEndDate = new Date(`${year}-12-31`);
    } else {
      filterEndDate = new Date();
      filterStartDate = new Date();
      filterEndDate.setDate(filterEndDate.getDate() - 1);
      filterStartDate.setDate(filterEndDate.getDate() - 6);
    }

    // Khởi tạo tất cả các ngày trong khoảng thời gian đã chọn
    const currentDate = new Date(filterStartDate);
    while (currentDate <= filterEndDate) {
      const dateKey = currentDate.toISOString().split('T')[0];
      analysis[dateKey] = {
        sales: 0,
        countOrder: 0,
        viewProduct: 0,
        viewShop: 0,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Tính toán số lần xem shop và nhóm theo ngày
    shop.ShopView.forEach((view) => {
      const viewDate = new Date(view.created_at).toISOString().split('T')[0];
      if (
        new Date(viewDate) >= filterStartDate &&
        new Date(viewDate) <= filterEndDate
      ) {
        if (analysis[viewDate]) {
          analysis[viewDate].viewShop++;
        }
      }
    });

    // Tính toán số lần xem sản phẩm và nhóm theo ngày
    const viewProduct = listProduct.flatMap((item) => item.product_view);
    viewProduct.forEach((view) => {
      const viewDate = new Date(view.created_at).toISOString().split('T')[0];
      if (
        new Date(viewDate) >= filterStartDate &&
        new Date(viewDate) <= filterEndDate
      ) {
        if (analysis[viewDate]) {
          analysis[viewDate].viewProduct++;
        }
      }
    });

    // Tính toán số đơn hàng và doanh thu và nhóm theo ngày
    complatedOrder.forEach((order) => {
      const status = order.statusUpdate.find(
        (item) => item.key === 'Hoàn thành',
      );
      const orderDate = new Date(status.value).toISOString().split('T')[0];

      if (
        new Date(orderDate) >= filterStartDate &&
        new Date(orderDate) <= filterEndDate
      ) {
        if (analysis[orderDate]) {
          analysis[orderDate].countOrder++;
          analysis[orderDate].sales += order.subTotal;
        }

        // Xử lý top sản phẩm
        order.items.forEach((item) => {
          const productId = item.productPriceId.id_product[0]._id;

          if (!productMap[productId]) {
            productMap[productId] = {
              product: item.productPriceId.id_product[0],
              quantity: 0,
            };
          }
          productMap[productId].quantity += item.quantity;
        });
      }
    });

    // Chuyển đổi productMap thành mảng và sắp xếp theo số lượng bán ra
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 4); // Lấy top 4 sản phẩm

    return {
      analysis: analysis,
      topProducts: topProducts,
    };
  }
}
