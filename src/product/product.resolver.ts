import { Args, Query, Resolver } from "@nestjs/graphql";
import { Product } from "./product.model";
import { ProductService } from "./product.service";
import { Public } from "../common/decorators";
import {
  INormalizedGqlRequestedPaths,
  NormalizeGqlResolveInfo,
} from "../common/utils/normalize-gql-resolve-info";
import { ProductsPaginatedResult } from "./types/products-paginated.result";
import { PaginationInput } from "../modules/pagination/types/pagination.input";
import { IPaginationResult } from "../modules/pagination/interfaces/pagination-result.interface";
import { GetProductArgs } from "./types/get-product.args";
import {ProductFiltersInput} from "./types/product-filters.input";

@Public()
@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => Product, { name: "product" })
  async getProduct(
    @NormalizeGqlResolveInfo.RequestedPaths({ isPaginated: true })
    requestedPaths: INormalizedGqlRequestedPaths,
    @Args() args: GetProductArgs
  ): Promise<Product> {
    return this.productService.findById(requestedPaths, args.id);
  }

  @Query(() => ProductsPaginatedResult, { name: "products" })
  async getProducts(
    @NormalizeGqlResolveInfo.RequestedPaths({ isPaginated: true })
    requestedPaths: INormalizedGqlRequestedPaths,
    @Args("pagination", { nullable: true }) pagination?: PaginationInput,
    @Args("filters", {nullable: true}) filters?: ProductFiltersInput
  ): Promise<IPaginationResult<Product>> {
    return this.productService.findAll(requestedPaths, pagination, filters);
  }
}
