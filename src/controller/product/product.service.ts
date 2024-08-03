import { Length } from 'class-validator';
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { ShopService } from '../seller/shop/shop.service';
import { ProductSpecification } from './schemas/product_specification.schema';
import { CreateProductSpecificationDto } from './dto/create-product_specification.dto';
import { ProductPriceService } from '../variation/product-price/product-price.service';
import { payload } from '../customer/interface/customer.interface';
import { UploadService } from 'src/middleware/upload/upload.service';
import { DiscountService } from '../marketing/discount/discount.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ProductSpecification.name)
    private readonly productSpecificationModel: Model<ProductSpecification>,
    private readonly shopService: ShopService,
    private readonly productVariation: ProductPriceService,
    private readonly uploadService: UploadService,
    private readonly discountService: DiscountService,
  ) { }

  async create(createProductDto: CreateProductDto, payload) {
    const shop = await this.shopService.create(payload);
    createProductDto.id_shop = shop._id;
    const newProduct = await this.productModel.create(createProductDto);

    if (createProductDto.specifications) {
      Object.keys(createProductDto.specifications).map(async (key) => {
        const specification: CreateProductSpecificationDto = {
          id_product: newProduct._id,
          id_specifications: key,
          id_specifications_detail: createProductDto.specifications[key],
        };
        await this.createProductSpecification(specification);
      });
    }

    if (createProductDto.variation) {
      this.createVariationProduct(newProduct._id, createProductDto.variation);
    }

    return newProduct;
  }

  async createProductSpecification(
    createProductSpecification: CreateProductSpecificationDto,
  ) {
    this.productSpecificationModel.create(createProductSpecification);
  }
  async createVariationProduct(idProduct, variation) {
    // await this.productVariation.
    this.productVariation.createVariation(idProduct, variation);
  }

  createProductPrice(idProduct, productPrice) {
    this.productVariation.createProductPrice(idProduct, productPrice);
  }

  async findAll() {
    const products = await this.productModel
      .find()
      .populate('id_shop')
      .populate('product_price')
      .populate('id_categoryDetail')
      .lean()
      .exec();
    let listProducts: any[] = [];
    await Promise.all(
      products.map(async (item: any) => {
        if (item.product_price.length > 0) {
          if(item.product_price.length > 0) {
            const maxPrice = getMaxPrice(item.product_price);
            item.priceMax = maxPrice;
          }
          const listIdProductPrice = item.product_price.map((price: any) => price._id);
          const listDiscountByProductPrice = await Promise.all(
            listIdProductPrice.map(async (id: any) => {
              return await this.discountService.findOneByIdProductPrice(id);
            })
          );
          const checkListIsAvailibale = listDiscountByProductPrice.filter((item: any) => {
            const isTime = item && item.id_discount && item.id_discount.time_start && item.id_discount.time_end
            if (isTime && item.status === true) {
              return item;
            }
          })
          if (checkListIsAvailibale.length > 0) {
            item.discount = checkListIsAvailibale;
            const maxPerent = getMaxPercent(checkListIsAvailibale);
            item.percent = maxPerent;
            const minMaxPriceAfferDiscount = getMinMaxPriceAfterDiscount(item.product_price, checkListIsAvailibale);
            if (minMaxPriceAfferDiscount) {
              item.valuePriceDiscount = minMaxPriceAfferDiscount;
            }
            else {
              item.valuePriceDiscount = null;
            }
          }
          listProducts.push(item);
        }
      })
    );
    return handleThumbnailListProduct(listProducts);
  }


  async findOne(id: ObjectId) {
    try {
      const product: any = await this.productModel
        .findById(id)
        .populate('id_categoryDetail')
        .populate({
          path: 'product_specifications',
          populate: [{ path: 'id_specifications' }, { path: 'id_specifications_detail' }],
        })
        .populate('variation_color')
        .populate('variation_size')
        .populate({
          path: 'product_price',
          populate: [{ path: 'id_color' }, { path: 'id_size' }],
        })
        .populate('id_shop')
        .lean()
        .exec();
      if (!product) throw new HttpException('Không tìm thấy sản phẩm', 404);
      if (product?.product_price?.length > 0) {
        const listIdProductPrice = product.product_price.map((item: any) => item._id);
        const listDiscountByProductPrice = await Promise.all(
          listIdProductPrice.map(async (item: any) => {
            return await this.discountService.findOneByIdProductPrice(item);
          })
        );
        // console.log(listDiscountByProductPrice);

        const checkListIsAvailibale = listDiscountByProductPrice.filter((item: any) => {
          const isTime = item && item.id_discount && item.id_discount.time_start && item.id_discount.time_end
          if (isTime && item.status === true) {
            return item;
          }
        })
        product.discount = checkListIsAvailibale;
        if (checkListIsAvailibale.length > 0) {
          const minMaxPriceAfferDiscount = getMinMaxPriceAfterDiscount(product.product_price, checkListIsAvailibale);

          if (minMaxPriceAfferDiscount) {
            product.valuePriceDiscount = minMaxPriceAfferDiscount;
          }
          else {
            product.valuePriceDiscount = null;
          }
        }
      }
      return handleThumbnailproduct(product);
    } catch (error) {
      console.log('error find by id product' + error);
      throw new InternalServerErrorException();
    }
  }

  async findByIdShop(id_shop: string) {
    const products = await this.productModel
      .find<CreateProductDto[]>({
        id_shop,
      })
      .populate({
        path: 'product_price',
        populate: [{ path: 'id_color' }, { path: 'id_size' }],
      })
      .populate({
        path: 'id_categoryDetail',
        populate: { path: 'id_category' },
      })
      .lean();
    return handleThumbnailListProduct(products);
  }

  // async productQuery(q: any) {
  //   console.log(q);
    
    
  // }
  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      if (updateProductDto.variation) {
        await this.productVariation.removeByIdProduct(id);
        await this.createVariationProduct(id, updateProductDto.variation);
      }
      return this.productModel.findByIdAndUpdate(id, updateProductDto);
    } catch (error) {
      console.log('error update product' + error);
      throw new InternalServerErrorException();
    }
  }


  async updateUnlisted(
    idProduct,
    payload: payload,
    unlisted: { unlisted: boolean },
  ) {
    try {
      const product = await this.productModel
        .findById(idProduct)
        .populate('id_shop')
        .lean()
        .exec();
      if (product.id_shop[0].id_customer != payload.sub) {
        return new HttpException('Bạn không phải là người đăng', 401);
      }
      return await this.productModel.findByIdAndUpdate(idProduct, unlisted);
    } catch (error) {
      console.log('error find by id product' + error);
      throw new InternalServerErrorException();
    }
  }

  async updateBanned(idProduct, payload: payload, banned: { banned: boolean }) {
    try {
      const product = await this.productModel
        .findById(idProduct)
        .populate('id_shop')
        .lean()
        .exec();
      if (product.id_shop[0].id_customer != payload.sub) {
        return new HttpException('Bạn không phải là người đăng', 401);
      }
      return await this.productModel.findByIdAndUpdate(idProduct, banned);
    } catch (error) {
      console.log('error find by id product' + error);
      throw new InternalServerErrorException();
    }
  }

  updateThumbnail(id_product: string, thumbnails) {
    try {
      return this.productModel.findByIdAndUpdate(id_product, thumbnails);
    } catch (error) {
      console.log('error update product' + error);
      throw new InternalServerErrorException();
    }
  }

  async updateProductSpecification(updateProductDto) {
    try {
      const id_product = updateProductDto.id_product;
      Object.keys(updateProductDto.specification).map(async (key) => {
        const id_specification = key;
        const id_specification_detail = updateProductDto.specification[key];
        const check = await this.productSpecificationModel.find({
          id_product: id_product,
          id_specifications: id_specification,
        });
        if (check.length > 0) {
          return this.productSpecificationModel.findByIdAndUpdate(
            check[0]._id,
            {
              id_specifications_detail: id_specification_detail,
            },
          );
        } else {
          const specification: CreateProductSpecificationDto = {
            id_product: id_product,
            id_specifications: id_specification,
            id_specifications_detail: id_specification_detail,
          };
          await this.createProductSpecification(specification);
        }
      });
    } catch (error) {
      console.log('error update product' + error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: string) {
    try {
      const product = await this.productModel.findById(id);
      await this.productModel.findByIdAndDelete(id);
      await this.productSpecificationModel.deleteMany({
        id_product: product._id,
      });
      await this.productVariation.removeByIdProduct(product._id);
      await this.uploadService.deleteFile(product.thumbnails);
    } catch (error) {
      console.log('error remove product' + error);
      throw new InternalServerErrorException();
    }
  }
}
export function handleThumbnailListProduct(listProduct) {
  const updatedProducts = listProduct.map((product) => {
    return handleThumbnailproduct(product);
  });
  return updatedProducts;
}
export function handleThumbnailproduct(product) {
  const updatedThumbnail = product.thumbnails.map((imageUrl) => {
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      return `${process.env.URL_API}uploads/${imageUrl}`;
    }
    return imageUrl;
  });
  return { ...product, thumbnails: updatedThumbnail };
}
export function getMinMaxPriceAfterDiscount(productPrices: any, discounts: any): { minPrice: number; maxPrice: number } | null {
  if (productPrices?.length === 0) return null;

  let minPrice = 0;
  let maxPrice = 0;
  productPrices?.forEach((priceObj: any) => {
    const price = priceObj?.price;
    const check = discounts?.find((item: any) => item?.id_productPrice.toString() === priceObj?._id.toString())
    //  console.log(check);

    if (check) {
      const percent = check?.percent;
      const newPrice = discountPrice(price, percent);
      if (newPrice < minPrice || minPrice === 0) {
        minPrice = newPrice;
      }
      if (newPrice > maxPrice) {
        maxPrice = newPrice;
      }
    }
  });

  return { minPrice, maxPrice };
};

export function discountPrice(price: number, percent: number) {
  return price - (price * percent) / 100
}
export function getMaxPercent(discounts: any) {
  let maxPercent = 0;
  discounts?.forEach((discount: any) => {
    if (discount?.percent > maxPercent) {
      maxPercent = discount?.percent;
    }
  });
  return maxPercent;
}
export function getMaxPrice(productPrice: any) {
  let maxPrice = 0;
  productPrice?.forEach((priceObj: any) => {
    if (priceObj?.price > maxPrice) {
      maxPrice = priceObj?.price;
    }
  });
  return maxPrice;
}