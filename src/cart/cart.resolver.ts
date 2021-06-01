import {Mutation, Query, Resolver} from "@nestjs/graphql";
import {CurrentUser, Public} from "../common/decorators";
import {CartService} from "./cart.service";
import {Cart} from "./cart.model";
import {User} from "../users/user.model";

@Resolver()
@Public()
export class CartResolver {
  constructor(private readonly cartService: CartService) {
  }

  @Query(() => [Cart], {name: "cart"})
  async getCart(@CurrentUser() user: User): Promise<Cart[]> {
    return this.cartService.getCart(user);
  }

  @Mutation(() => [Cart], {name: "addItemToCart"})
  async addItemToCart(@CurrentUser() user: User): Promise<Cart[]> {
    return this.cartService.addItemToCart(user);
  }
}
