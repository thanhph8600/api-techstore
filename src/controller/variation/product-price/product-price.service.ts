import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateProductPriceDto } from './dto/update-product-price.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ProductPrice } from './schemas/productPrice.schema';
import { Model } from 'mongoose';
import { VariationColor } from './schemas/variationColor.schema';
import { VariationSize } from './schemas/variationSize.schema';

@Injectable()
export class ProductPriceService {
  constructor(
    @InjectModel(ProductPrice.name)
    private readonly productpriceModel: Model<ProductPrice>,
    @InjectModel(VariationColor.name)
    private readonly variationColorModel: Model<VariationColor>,
    @InjectModel(VariationSize.name)
    private readonly variationSizeModel: Model<VariationSize>,
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

  findOne(id: number) {
    return `This action returns a #${id} productPrice`;
  }

  update(id: number, updateProductPriceDto: UpdateProductPriceDto) {
    console.log(updateProductPriceDto);
    return `This action updates a #${id} productPrice`;
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
