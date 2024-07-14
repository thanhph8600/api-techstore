/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from './schemas/cart.schema';
import { Model } from 'mongoose';
@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}
  async create(CreateCartDto: CreateCartDto) {
    try {
      const cart = await this.findOneByName(CreateCartDto.customerId);
      if (cart.length != 0) {
        return new HttpException('err', 401);
      }
      const newCart = await this.cartModel.create(CreateCartDto);
      return newCart;
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
      const cart = await this.cartModel.findOne({ customerId: id }).exec();
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
      const cart = await this.cartModel.findOne({ customerId: id }).exec();
      if (!cart) {
        throw new NotFoundException(`Cart with customerId ${id} not found`);
      }
      const { productId, quantity } = updateCartDto;
      // console.log(cart.cartItems, productId, quantity)
      const checkProductId = cart.cartItems.find(
        (item: any) => item.productId == productId,
      );
      if (checkProductId) {
        checkProductId.quantity += quantity;
        if (checkProductId.quantity <= 0) {
          cart.cartItems = cart.cartItems.filter(
            (item) => item.productId != productId,
          );
        }
      } else if (quantity > 0) {
        cart.cartItems.push({ productId, quantity });
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
