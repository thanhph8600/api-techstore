import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model } from 'mongoose';
@Injectable()
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(ProductSpecification.name)
    private readonly productSpecificationService: Model<ProductSpecification>,
    private readonly shopService: ShopService,
    private readonly productVariation: ProductPriceService,
  ) {}

  async create(createProductDto: CreateProductDto, payload) {
    console.log(createProductDto);
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
    this.productSpecificationService.create(createProductSpecification);
  }
  createVariationProduct(idProduct, variation) {
    this.productVariation.createVariation(idProduct, variation);
  }

  createProductPrice(idProduct, productPrice) {
    this.productVariation.createProductPrice(idProduct, productPrice);
  }

  async findAll() {
    try {
      const listProducts = await this.productModal.find();
      return listProducts;
    } catch (error) {
      console.log('error find all product', error);
      throw new InternalServerErrorException();
    }
    const products = await this.productModel
      .find()
      .populate('id_shop')
      .populate('product_price')
      .lean()
      .exec();
    return handleThumbnailListProduct(products);

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
      .lean();
    return handleThumbnailListProduct(products);
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    try {
      return this.productModel.findByIdAndUpdate(id, updateProductDto);
    } catch (error) {
      console.log('error update product' + error);
      throw new InternalServerErrorException();
    }
  }

  updateProductSpecification(updateProductDto: UpdateProductDto) {
    try {
      console.log(updateProductDto);
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
