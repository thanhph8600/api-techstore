import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model, ObjectId } from 'mongoose';
import { ShopService } from '../seller/shop/shop.service';
import { ProductSpecification } from './schemas/product_specification.schema';
import { CreateProductSpecificationDto } from './dto/create-product_specification.dto';
import { ProductPriceService } from '../variation/product-price/product-price.service';
import { payload } from '../customer/interface/customer.interface';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ProductSpecification.name)
    private readonly productSpecificationModel: Model<ProductSpecification>,
    private readonly shopService: ShopService,
    private readonly productVariation: ProductPriceService,
  ) {}

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
      .lean()
      .exec();
    return handleThumbnailListProduct(products);
  }

  async findOne(id: ObjectId) {
    try {
      const product = await this.productModel
        .findById(id)
        .populate('id_categoryDetail')
        .populate('product_specifications')
        .populate('variation_color')
        .populate('variation_size')
        .populate({
          path: 'product_price',
          populate: [{ path: 'id_color' }, { path: 'id_size' }],
        })
        .lean()
        .exec();
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
      .populate('product_price')
      .lean();
    return handleThumbnailListProduct(products);
  }

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

  async updateBanned(
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

  remove(id: number) {
    return `This action removes a #${id} product`;
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
