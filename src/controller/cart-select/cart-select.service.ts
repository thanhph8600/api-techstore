import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCartSelectDto } from './dto/create-cart-select.dto';
import { UpdateCartSelectDto } from './dto/update-cart-select.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CartSelect } from './schemas/cartSelect.schema';
import { Model, Types } from 'mongoose';
import { NotFoundError } from 'rxjs';
@Injectable()
export class CartSelectService {
  constructor(
    @InjectModel(CartSelect.name) private readonly cartSelectModal: Model<CartSelect>
  ) { }
  async create(createCartSlecteDto: CreateCartSelectDto) {
    try {
      const newCartSlecte = new this.cartSelectModal(createCartSlecteDto);
      await newCartSlecte.save();
    } catch (error) {
      console.log('error cartSlecte create', error);
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all cartSelect`;
  }

  async findOne(id: string): Promise<CartSelect> {
    const customerId = new Types.ObjectId(id);
    const cartSelecte = await this.cartSelectModal.findOne({ customerId: customerId }).exec();
    return cartSelecte;
  }

  async update(id: string, updateCartSlecteDto: any): Promise<CartSelect> {
    const customerId = new Types.ObjectId(id);
    const { productPriceId } = updateCartSlecteDto;
    const CartSelect = await this.cartSelectModal.findOne({ customerId: customerId }).exec();
    if (!CartSelect) {
      const newCartSlecte = {
        customerId: customerId,
        listProductSelect: updateCartSlecteDto.listProductSelect
      }
      await this.cartSelectModal.create(newCartSlecte);
      const cartSelecte = await this.cartSelectModal.findOne({ customerId: customerId }).exec();
      cartSelecte.listProductSelect.push(productPriceId);
      return await cartSelecte.save();
    } else {
      const checkProductPriceId = CartSelect.listProductSelect.find((item: any) => item._id == productPriceId);
      if (checkProductPriceId) {
        CartSelect.listProductSelect = CartSelect.listProductSelect.filter((item: any) => item._id != productPriceId);
        return await CartSelect.save();
      } else {
        CartSelect.listProductSelect.push(productPriceId);
        return await CartSelect.save();
      }
    }
  }
  async selectAll(id: string , updateCartSlecteDto: any): Promise<CartSelect> {
    const customerId = new Types.ObjectId(id);
    if(updateCartSlecteDto.type === 'true') {
      const CartSelect = await this.cartSelectModal.findOneAndUpdate({ customerId: customerId }, {listProductSelect: updateCartSlecteDto.listProductSelect}).exec();
      return CartSelect;
    }else {
      const CartSelect = await this.cartSelectModal.findOneAndUpdate({ customerId: customerId }, {listProductSelect: []}).exec();
      return CartSelect;
    }
  }
  async removeChildItem(id: string, updateCartSlecteDto: any): Promise<CartSelect> {
    const customerId = new Types.ObjectId(id);
    const { productPriceId } = updateCartSlecteDto;
    try {
      const CartSelect = await this.cartSelectModal.findOne({ customerId: customerId }).exec();
      if (!CartSelect) {
        throw new NotFoundError(`Cart with customerId ${id} not found`);
      }
      CartSelect.listProductSelect = CartSelect.listProductSelect.filter(
        (item: any) => item._id != productPriceId,
      );
      return await CartSelect.save();
    } catch (error) {
      console.error('Error in removeChildItem:', error);
      throw new InternalServerErrorException();
    }
  }

  remove(id: number) {
    return `This action removes a #${id} cartSelect`;
  }
}
