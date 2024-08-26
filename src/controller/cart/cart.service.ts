/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { ProductPriceService } from '../variation/product-price/product-price.service';
import { CartSelectService } from '../cart-select/cart-select.service';
import { DiscountService } from '../marketing/discount/discount.service';
@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
    private readonly productPriceService: ProductPriceService,
    private readonly cartSelectService: CartSelectService,
    // private readonly discountService: DiscountService
  ) { }
  async create(createCartDto: CreateCartDto) {
    try {
      const newCart = new this.cartModel(createCartDto);
      await newCart.save();
    } catch (error) {
      console.log('error cart create', error);
      throw new InternalServerErrorException();
    }
  }
  findById(id: string) {
    throw new Error(`${id} not found`);
  }
  findAll() {
    return `This action returns all cart`;
  }
  findOneByName(name: string) {
    return this.cartModel.find({ name });
  }
  async findOne(id: string): Promise<Cart> {
    try {
      const customerId = new Types.ObjectId(id);
      const cart = await this.cartModel
        .findOne({ customerId: customerId })
        .populate('cartItems.shopId')
        .populate({
          path: 'cartItems.items.productPriceId',
          select: 'id_color id_product id_size price stock',
          populate: [
            {
              path: 'id_product',
              select: 'id_shop , id_categoryDetail, name , thumbnails',
              populate: {
                path: 'id_shop',
              },
            },
            {
              path: 'id_color',
              select: 'value thumbnail',
            },
            {
              path: 'id_size',
            },
          ],
        })
        .populate({
          path: 'cartItems.items.discountDetailId',
          select: 'id_discount percent limit_product limit_customer status',
          populate: {
            path: 'id_discount',
          },
        });
      if (!cart) {
        throw new NotFoundException(`Cart with customerId ${id} not found`);
      }
      const checkStockItemNotValid = cart?.cartItems?.map((item: any) => {
        return item.items.find((itemOfItems: any) => {
          return itemOfItems.productPriceId.stock < itemOfItems.quantity;
        });
      }).filter((item: any) => item !== undefined);
  
      if (checkStockItemNotValid.length > 0) {
        const cartSelect = await this.cartSelectService.findOne(id);
        if (!cartSelect) {
          throw new NotFoundException(`Cart with customerId ${id} not found`);
        }
        const checkStockItemNotValidIds = checkStockItemNotValid.map((item: any) => item?.productPriceId?._id).filter((id: any) => id); // Filter out undefined IDs
  
        const updatedListProductSelect = cartSelect.listProductSelect.filter((item: any) => {
          return checkStockItemNotValidIds.every((invalidId: any) => {
            if (item._id && invalidId) {
              return !invalidId.equals(item._id);
            }
            return true;
          });
        });
  
        await this.cartSelectService.updateSelect(id, {
          listProductSelect: updatedListProductSelect,
        });
        return cart;
      }
      return cart;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw new InternalServerErrorException();
    }
  }
  

  async update(id: string, updateCartDto: any): Promise<any> {
    const customerId = new Types.ObjectId(id);
    try {
      const cart = await this.cartModel
        .findOne({ customerId: customerId })
        .exec();
      const { shopId, items } = updateCartDto;
      const { productPriceId, quantity, discountDetailId } = items;
      if (!cart) {
        throw new NotFoundException(`Cart with customerId ${id} not found`);
      }
      const checkShopId = cart.cartItems.find(
        (item: any) => item.shopId == shopId,
      );
      const productPrice =
        await this.productPriceService.findOne(productPriceId);
      if (checkShopId) {
        const checkProductPrice = checkShopId.items.find(
          (item: any) => item.productPriceId == productPriceId,
        );
        if (checkProductPrice) {
          checkProductPrice.quantity += quantity;
          if (checkProductPrice.quantity <= 0) {
            checkShopId.items = checkShopId.items.filter(
              (item) => item.productPriceId != productPriceId,
            );
            if (checkShopId.items.length == 0) {
              cart.cartItems = cart.cartItems.filter(
                (item) => item.shopId != shopId,
              );
            }
            const cartSelect = await this.cartSelectService.findOne(id);
            const checkIfHave = cartSelect.listProductSelect.find(
              (item: any) => item._id == productPriceId,
            );
            if (checkIfHave) {
              this.cartSelectService.removeChildItem(id, updateCartDto);
            }
          } else if (checkProductPrice.quantity > productPrice.stock) {
            if (
              productPrice.stock > 0 &&
              items.quantity === -1 &&
              checkProductPrice.quantity > productPrice.stock
            ) {
              checkProductPrice.quantity = productPrice.stock;
            } else {
              checkProductPrice.quantity -= quantity;
              const countCanAdd =
                productPrice.stock - checkProductPrice.quantity;
              return {
                status: 299,
                message:
                  'Số lượng sản phẩm hiện tại trong kho không đủ để cung cấp.',
                count: countCanAdd,
              };
            }
          }
        } else {
          if (updateCartDto.items.discountDetailId) {
            checkShopId.items.push(updateCartDto.items);
          } else {
            checkShopId.items.push(updateCartDto.items);
          }
        }
      } else {
        cart.cartItems.push(updateCartDto);
      }
      return await cart.save();
    } catch (error) {
      console.error('Error in update:', error);
      throw new InternalServerErrorException();
    }
  }

  async updateQuantityProductPrice(
    customerId: string,
    { shopId, productPriceId, quantity }: any,
  ) {
    const cart = await this.cartModel
      .findOne({ customerId: customerId })
      .exec();
    const shop = cart.cartItems.find((item: any) => item.shopId == shopId);
    const productPrice = shop.items.find(
      (item: any) => item.productPriceId == productPriceId,
    );
    productPrice.quantity = quantity;
    return await cart.save();
  }
  async removeChildItem(id: string, updateCartDto: any) {
    const customerId = new Types.ObjectId(id);
    const { productPriceId, shopId } = updateCartDto;
    try {
      const cart = await this.cartModel
        .findOne({ customerId: customerId })
        .select('-__v')
        .exec();
      if (!cart) {
        throw new NotFoundException(`Cart with customerId ${id} not found`);
      }
      const checkShopId = cart.cartItems.find(
        (item: any) => item.shopId == shopId,
      );
      checkShopId.items = checkShopId.items.filter(
        (item: any) => item.productPriceId != productPriceId,
      );
      if (checkShopId.items.length == 0) {
        cart.cartItems = cart.cartItems.filter((item) => item.shopId != shopId);
      }
      const cartSelect = await this.cartSelectService.findOne(id);
      const checkIfHave = cartSelect.listProductSelect.find(
        (item: any) => item._id == productPriceId,
      );
      if (checkIfHave) {
        this.cartSelectService.removeChildItem(id, { productPriceId });
      }
      return await cart.save();
    } catch (error) {
      console.error('Error in removeChildItem:', error);
      throw new InternalServerErrorException();
    }
  }
  async remove(id: number): Promise<Cart> {
    return this.cartModel.findOneAndDelete({ customerId: id }).exec();
  }
}
