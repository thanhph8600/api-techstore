import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductPrice } from './schemas/productPrice.schema';
import { Model , Types} from 'mongoose';
import { VariationColor } from './schemas/variationColor.schema';
import { VariationSize } from './schemas/variationSize.schema';
import { CartSelectService } from 'src/controller/cart-select/cart-select.service';

@Injectable()
export class ProductPriceService {
  constructor(
    @InjectModel(ProductPrice.name)
    private readonly productpriceModel: Model<ProductPrice>,
    @InjectModel(VariationColor.name)
    private readonly variationColorModel: Model<VariationColor>,
    @InjectModel(VariationSize.name)
    private readonly variationSizeModel: Model<VariationSize>,
    private readonly cartSelectService : CartSelectService
  ) {}
  async createProductPrice(idProduct, productPrice) {
    try {
      const pricePromises = productPrice.map(async (item) => {
        const sizeQuery = { id_product: idProduct, value: item.name_size };
        const colorQuery = { id_product: idProduct, value: item.name_color };

        const size = await this.variationSizeModel.findOne(sizeQuery);
        const color = await this.variationColorModel.findOne(colorQuery);

        if (!size) {
          console.error(
            `Size not found for query: ${JSON.stringify(sizeQuery)}`,
          );
        }
        if (!color) {
          console.error(
            `Color not found for query: ${JSON.stringify(colorQuery)}`,
          );
        }

        const newProductPrice = {
          id_product: idProduct,
          id_size: size?._id,
          id_color: color?._id,
          price: item.price,
          stock: item.stock,
        };
        return this.productpriceModel.create(newProductPrice);
      });
      await Promise.all(pricePromises);

      return 'This action adds a new productPrice';
    } catch (error) {
      console.log('Error creating product price:', error);
      throw new InternalServerErrorException();
    }
  }

  async createVariation(idProduct, variations) {
    const variationPromises = Object.keys(variations).map(async (key) => {
      if (key === 'Màu sắc') {
        const colorPromises = variations[key].map(async (item) => {
          const newVariation = this.itemVariation(
            idProduct,
            item.name,
            item.thumbnail,
          );
          return this.variationColorModel.create(newVariation);
        });
        await Promise.all(colorPromises);
      }
      if (key === 'Size') {
        const sizePromises = variations[key].map(async (item) => {
          const newVariation = this.itemVariation(idProduct, item.name);
          return this.variationSizeModel.create(newVariation);
        });
        await Promise.all(sizePromises);
      }
    });

    await Promise.all(variationPromises);
  }
  itemVariation(idProduct, value, thumbnail?) {
    return {
      id_product: idProduct,
      value: value,
      thumbnail,
    };
  }
  findAll() {
    return `This action returns all productPrice`;
  }

  findOne(id: string) {
    return this.productpriceModel.findById(id).exec();
  }

  async checkStockIsAvailable(id: string, quantity: number , customerId: string): Promise<boolean> {
    const productPriceId = new Types.ObjectId(id);
    const productPrice = await this.productpriceModel.findOne({ _id: productPriceId }).exec();
    if (!productPrice) {
      throw new Error(`Product Price with ID ${productPriceId} not found.`);
    }
    if (productPrice.stock < quantity) {
      await this.cartSelectService.removeChildItem(customerId, { productPriceId: productPrice._id});
      return false;
    }
    return true;
  }
  
  async update(id: string, updateProductPriceDto: UpdateProductPriceDto) {
    const productPriceId = new Types.ObjectId(id);
    const update = await this.productpriceModel.findByIdAndUpdate(productPriceId, updateProductPriceDto);
    return update
  }
  async updateVation(id: string, updateProductPriceDto: UpdateProductPriceDto) {
    console.log(updateProductPriceDto);
    await this.productpriceModel.findByIdAndUpdate(id, updateProductPriceDto);
  }

  remove(id: number) {
    return `This action removes a #${id} productPrice`;
  }

  async removeByIdProduct(idProduct: string) {
    await this.productpriceModel.deleteMany({ id_product: idProduct });
    await this.variationColorModel.deleteMany({ id_product: idProduct });
    await this.variationSizeModel.deleteMany({ id_product: idProduct });
  }
}
