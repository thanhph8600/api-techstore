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
import path from 'path';
@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}
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
        .populate({
          path: 'cartItems.productPriceId',
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
            },
            {
              path: 'id_size',
            },
          ],
        });
      if (!cart) {
        throw new NotFoundException(`Cart with customerId ${id} not found`);
      }
      return cart;
    } catch (error) {
      console.error('Error in findOne:', error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: string, updateCartDto: any): Promise<Cart> {
    try {
      const customerId = new Types.ObjectId(id);
      const cart = await this.cartModel
        .findOne({ customerId: customerId })
        .exec();
      if (!cart) {
        throw new NotFoundException(
          `Cart with customerId ${customerId} not found`,
        );
      }
      const { productPriceId, quantity } = updateCartDto;
      // console.log(cart.cartItems, productId, quantity)
      const checkProductId = cart.cartItems.find(
        (item: any) => item.productPriceId == productPriceId,
      );
      if (checkProductId) {
        checkProductId.quantity += quantity;
        if (checkProductId.quantity <= 0) {
          cart.cartItems = cart.cartItems.filter(
            (item) => item.productPriceId != productPriceId,
          );
        }
      } else if (quantity > 0) {
        cart.cartItems.push({ productPriceId, quantity });
      } else {
        throw new HttpException('err', 401);
      }
      return await cart.save();
    } catch (error) {
      console.error('Error in update:', error);
      throw new InternalServerErrorException();
    }
  }
  async removeChildItem(id: string, productId: string): Promise<Cart> {
    try {
      const cart = await this.cartModel.findOne({ customerId: id }).exec();
      if (!cart) {
        throw new NotFoundException(`Cart with customerId ${id} not found`);
      }
      cart.cartItems = cart.cartItems.filter(
        (item: any) => item.productId != productId,
      );
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
