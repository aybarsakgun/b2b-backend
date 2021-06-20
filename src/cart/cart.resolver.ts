import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {CurrentUser} from "../common/decorators";
import {CartService} from "./cart.service";
import {Cart} from "./cart.model";
import {User} from "../users/user.model";
import {AddItemToCartInput} from "./types/add-item-to-cart.input";
import {INormalizedGqlRequestedPaths, NormalizeGqlResolveInfo} from "../common/utils/normalize-gql-resolve-info";

@Resolver()
export class CartResolver {
  constructor(private readonly cartService: CartService) {
  }

  @Query(() => [Cart], {name: "cart"})
  async getCart(
    @CurrentUser() user: User,
    @NormalizeGqlResolveInfo.RequestedPaths() requestedPaths: INormalizedGqlRequestedPaths,
  ): Promise<Cart[]> {
    return this.cartService.getCart(user, requestedPaths);
  }

  @Mutation(() => [Cart], {name: "addItemToCart"})
  async addItemToCart(
    @Args('data') input: AddItemToCartInput,
    @CurrentUser() user: User,
    @NormalizeGqlResolveInfo.RequestedPaths() requestedPaths: INormalizedGqlRequestedPaths,
  ): Promise<Cart[]> {
    return this.cartService.addItemToCart(input, user, requestedPaths);
  }

  @Mutation(() => [Cart], {name: "removeItemFromCart"})
  async removeItemFromCart(
    @Args('id', {type: () => Int}) id: number,
    @CurrentUser() user: User,
    @NormalizeGqlResolveInfo.RequestedPaths() requestedPaths: INormalizedGqlRequestedPaths,
  ): Promise<Cart[]> {
    return this.cartService.removeItemFromCart(id, user, requestedPaths);
  }

  @Mutation(() => [Cart], {name: "removeAllItemsFromCart"})
  async removeAllItemsFromCart(
    @CurrentUser() user: User
  ): Promise<Cart[]> {
    return this.cartService.removeAllItemsFromCart(user);
  }
}
