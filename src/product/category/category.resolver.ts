import { Args, Query, Resolver } from "@nestjs/graphql";
import {CurrentUser, Public} from "../../common/decorators";
import { CatalogFiltersInput } from "../types/catalog-filters.input";
import { Category } from "./category.model";
import { CategoryService } from "./category.service";
import {
  INormalizedGqlRequestedPaths,
  NormalizeGqlResolveInfo,
} from "../../common/utils/normalize-gql-resolve-info";
import {User} from "../../users/user.model";

@Public()
@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: "categories" })
  async getCategories(
    @CurrentUser() user: User,
    @NormalizeGqlResolveInfo.RequestedPaths()
    requestedPaths: INormalizedGqlRequestedPaths,
    @Args("filters", { nullable: true }) filters?: CatalogFiltersInput
  ): Promise<Category[]> {
    return this.categoryService.findAll(user, requestedPaths, filters);
  }
}
