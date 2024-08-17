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
    console.log(variationPromises);
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

  async updateVation(updateProductPriceDto: UpdateProductPriceDto) {
    const variation = updateProductPriceDto.variation;
    const keys = Object.keys(variation);
    const listId = [];
    for (const key of keys) {
      for (const item of variation[key]) {
        const update = {
          id_product: updateProductPriceDto.id_product,
          value: item.name,
        };
        if (key === 'Size') {
          if (item._id) {
            await this.variationSizeModel.findByIdAndUpdate(item._id, update);
            listId.push(String(item._id));
          } else {
            const newVariation = this.itemVariation(
              updateProductPriceDto.id_product,
              item.name,
            );
            const newSize = await this.variationSizeModel.create(newVariation);
            listId.push(String(newSize._id));
          }
        } else if (key === 'Màu sắc') {
          if (item._id) {
            await this.variationColorModel.findByIdAndUpdate(item._id, {
              ...update,
              thumbnail: item.thumbnail,
            });
            listId.push(String(item._id));
          } else {
            const newVariation = this.itemVariation(
              updateProductPriceDto.id_product,
              item.name,
              item.thumbnail,
            );
            const newColor =
              await this.variationColorModel.create(newVariation);
            listId.push(String(newColor._id));
          }
        }
      }
    }
    const listColor = await this.variationColorModel.find({
      id_product: updateProductPriceDto.id_product,
    });
    const listSize = await this.variationSizeModel.find({
      id_product: updateProductPriceDto.id_product,
    });
    if (listColor.length > 0) {
      const idColor = listColor.map((item) => String(item._id));
      for (const id of idColor) {
        if (!listId.includes(id)) {
          await this.variationColorModel.findByIdAndDelete(id);
        }
      }
    }
    if (listSize.length > 0) {
      const idSize = listSize.map((item) => String(item._id));
      for (const id of idSize) {
        if (!listId.includes(id)) {
          await this.variationSizeModel.findByIdAndDelete(id);
        }
      }
    }
  }
  async updateProductPrice(updateProductPriceDto: UpdateProductPriceDto) {
    if (updateProductPriceDto.productPrice) {
      const listId: string[] = [];
      const listCreate = [];
      for (const item of updateProductPriceDto.productPrice) {
        if (item._id) {
          const update = {
            price: item.price,
            stock: item.stock,
          };
          await this.productpriceModel.findByIdAndUpdate(item._id, update);
          listId.push(item._id);
        } else {
          listCreate.push(item);
        }
      }
      const listProductPrice = await this.productpriceModel.find({
        id_product: updateProductPriceDto.id_product,
      });
      if (listProductPrice.length > 0) {
        for (const item of listProductPrice) {
          if (!listId.includes(String(item._id))) {
            await this.productpriceModel.findByIdAndDelete(String(item._id));
          }
        }
      }
      await this.createProductPrice(
        updateProductPriceDto.id_product,
        listCreate,
      );
    }
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
