import {Args, Query, Resolver} from "@nestjs/graphql";
import {Public} from "../../common/decorators";
import {CatalogFiltersInput} from "../types/catalog-filters.input";
import {Category} from "./category.model";
import {CategoryService} from "./category.service";
import {INormalizedGqlRequestedPaths, NormalizeGqlResolveInfo} from "../../common/utils/normalize-gql-resolve-info";

@Public()
@Resolver(() => Category)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService
  ) {
  }

  @Query(() => [Category], {name: "categories"})
  async getCategories(
    @NormalizeGqlResolveInfo.RequestedPaths()
      requestedPaths: INormalizedGqlRequestedPaths,
    @Args("filters", {nullable: true}) filters?: CatalogFiltersInput
  ): Promise<Category[]> {
    return this.categoryService.findAll(requestedPaths, filters);
  }
}
