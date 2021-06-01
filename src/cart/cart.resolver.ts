import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {CurrentUser, Public} from "../common/decorators";
import {CartService} from "./cart.service";
import {Cart} from "./cart.model";
import {User} from "../users/user.model";
import {AddItemToCartInput} from "./types/add-item-to-cart.input";
import {INormalizedGqlRequestedPaths, NormalizeGqlResolveInfo} from "../common/utils/normalize-gql-resolve-info";

@Resolver()
@Public()
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
}
