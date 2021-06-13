import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
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

    const cart = new Cart();
    cart.product = product;
    cart.productUnit = product.units.find(unit => unit.value === product.defaultUnit);
    cart.quantity = quantity ? quantity : 1;
    cart.user = user;

    await this.cartRepository.save(cart);

    return await this.getCart(user, requestedPaths);
  }
}
