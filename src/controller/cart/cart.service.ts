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
      const cart = await this.cartModel.findOne({ customerId: customerId })
        .populate({
          path: 'cartItems.productPriceId',
          select: 'id_color id_product id_size price stock',
          populate: [
            {
              path: 'id_product',
              select: 'id_shop , id_categoryDetail, name , thumbnails',
              populate: {
                path: 'id_shop',
              }
            },
            {
              path: 'id_color',
            },
            {
              path: 'id_size',
            },
          ]
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
    const customerId = new Types.ObjectId(id);
    const cart = await this.cartModel.findOne({ customerId: customerId }).exec();
    if (!cart) {
      throw new NotFoundException(`Cart with customerId ${customerId} not found`);
    }
    const { productPriceId, quantity } = updateCartDto;
    const checkProductId = cart.cartItems.find(
      (item: any) => item.productPriceId == productPriceId,
    );
    const productPrice = await this.productPriceService.findOne(productPriceId);
    if (checkProductId) {
      checkProductId.quantity += quantity;
      if (checkProductId.quantity <= 0) {
        cart.cartItems = cart.cartItems.filter(
          (item) => item.productPriceId != productPriceId,
        );
        const cartSelect = await this.cartSelectService.findOne(id);
        const checkIfHave = cartSelect.listProductSelect.find(
          (item: any) => item._id == productPriceId,
        )
        if (checkIfHave) {
          this.cartSelectService.removeChildItem(id, updateCartDto);
        }
      } else if (checkProductId.quantity > productPrice.stock) {
        checkProductId.quantity -= quantity;
        throw new HttpException('Số lượng vượt quá kho', 299);
      }
    } else if (quantity > 0) {
      cart.cartItems.push({ productPriceId, quantity });
    } else {
      throw new HttpException('Invalid quantity', 401);
    }
    return await cart.save();
  }

  async removeChildItem(id: string, updateCartDto: any) {
    const customerId = new Types.ObjectId(id);
    try {
      const cart = await this.cartModel.findOne({ customerId: customerId }).exec();
      if (!cart) {
        throw new NotFoundException(`Cart with customerId ${id} not found`);
      }
      cart.cartItems = cart.cartItems.filter(
        (item: any) => item.productPriceId != updateCartDto.productPriceId,
      );
      const cartSelect = await this.cartSelectService.findOne(id);
      const checkIfHave = cartSelect.listProductSelect.find(
        (item: any) => item._id == updateCartDto.productPriceId,
      )
      if (checkIfHave) {
        this.cartSelectService.removeChildItem(id, updateCartDto);
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
