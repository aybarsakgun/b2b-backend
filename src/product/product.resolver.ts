import {Args, Query, Resolver} from "@nestjs/graphql";
import {Product} from "./product.model";
import {ProductService} from "./product.service";
import {CurrentUser, Public} from "../common/decorators";
import {INormalizedGqlRequestedPaths, NormalizeGqlResolveInfo,} from "../common/utils/normalize-gql-resolve-info";
import {PaginationInput} from "../modules/pagination/types/pagination.input";
import {IPaginationResult} from "../modules/pagination/interfaces/pagination-result.interface";
import {GetProductArgs} from "./types/get-product.args";
import {paginatedTypeCreator} from "../modules/pagination/utils/paginated-type-creator";
import {User} from "../users/user.model";
import {CatalogFiltersInput} from "./types/catalog-filters.input";
import {CatalogSortingField, CatalogSortingInput} from "./types/catalog-sorting.input";
import {SortingType} from "../common/enums/sorting-type.enum";

const productsPaginatedResult = paginatedTypeCreator(Product);

@Public()
@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {
  }

  @Query(() => Product, {name: "product"})
  async getProduct(
    @NormalizeGqlResolveInfo.RequestedPaths()
      requestedPaths: INormalizedGqlRequestedPaths,
    @Args() args: GetProductArgs
  ): Promise<Product> {
    return this.productService.findById(requestedPaths, args.id);
  }

  @Query(() => productsPaginatedResult, {name: "products"})
  async getProducts(
    @CurrentUser() user: User,
    @NormalizeGqlResolveInfo.RequestedPaths({escapePaths: ["items"]})
      requestedPaths: INormalizedGqlRequestedPaths,
    @Args("pagination", {nullable: true}) pagination?: PaginationInput,
    @Args("filters", {nullable: true}) filters?: CatalogFiltersInput,
    @Args("sorting", {nullable: true, defaultValue: {field: CatalogSortingField.PRODUCT_NAME, order: SortingType.ASC}}) sorting?: CatalogSortingInput
  ): Promise<IPaginationResult<Product>> {
    return this.productService.findAll(user, requestedPaths, pagination, filters, sorting);
  }
}
