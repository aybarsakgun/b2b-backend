import {BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException} from "@nestjs/common";
import {CartRepository} from "./cart.repository";
import {Cart} from "./cart.model";
import {User} from "../users/user.model";
import {Product} from "../product/product.model";
import {ProductRepository} from "../product/product.repository";
import {AddItemToCartInput} from "./types/add-item-to-cart.input";
import {INormalizedGqlRequestedPaths} from "../common/utils/normalize-gql-resolve-info";
import {ProductMapper} from "../product/product.mapper";
import {ProductUnitMapper} from "../product/product-unit/product-unit.mapper";

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {
  }

  async getCart(user: User, requestedPaths: INormalizedGqlRequestedPaths): Promise<Cart[]> {
    if (!user) {
      throw new UnauthorizedException('MAIN.UNAUTHORIZED');
    }
    const cartItems = await this.cartRepository.findCartItemsByUser(user, requestedPaths).getMany();
    return cartItems.map((item) => ({
      ...item,
      product: ProductMapper.mapByUser(user)(item.product),
      productUnit: ProductUnitMapper.mapByUser(user)(item.productUnit)
    }));
  }

  async addItemToCart({productId, quantity}: AddItemToCartInput, user: User, requestedPaths: INormalizedGqlRequestedPaths): Promise<Cart[]> {
    if (!user) {
      throw new UnauthorizedException('MAIN.UNAUTHORIZED');
    }
    const product: Product = await this.productRepository.findOne(productId, {relations: ['units']});
    if (!product) {
      throw new BadRequestException('CART.PRODUCT_NOT_FOUND');
    }

    try {
      const cart = new Cart();
      cart.product = product;
      cart.productUnit = product.units.find(unit => unit.value === product.defaultUnit);
      cart.quantity = quantity ? quantity : 1;
      cart.user = user;

      await this.cartRepository.save(cart);
    } catch (e) {
      throw new InternalServerErrorException('CART.COULD_NOT_SAVE_ITEM_TO_CART');
    }

    return await this.getCart(user, requestedPaths);
  }

  async removeItemFromCart(id: number, user: User, requestedPaths: INormalizedGqlRequestedPaths): Promise<Cart[]> {
    if (!user) {
      throw new UnauthorizedException('MAIN.UNAUTHORIZED');
    }

    const cartItem: Cart = await this.cartRepository.findOne(id);
    if (!cartItem) {
      throw new BadRequestException('CART.CART_ITEM_NOT_FOUND');
    }

    try {
      await this.cartRepository.remove(cartItem);
    } catch (e) {
      throw new InternalServerErrorException('CART.COULD_NOT_REMOVE_ITEM_FROM_CART');
    }

    return await this.getCart(user, requestedPaths);
  }

  async removeAllItemsFromCart(user: User): Promise<Cart[]> {
    if (!user) {
      throw new UnauthorizedException('MAIN.UNAUTHORIZED');
    }

    try {
      await this.cartRepository.delete({user});
    } catch (e) {
      throw new InternalServerErrorException('CART.COULD_NOT_REMOVE_ALL_ITEMS_FROM_CART');
    }

    return [];
  }
}
