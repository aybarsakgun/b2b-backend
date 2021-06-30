import { Args, Query, Resolver } from "@nestjs/graphql";
import {CurrentUser, Public} from "../../common/decorators";
import { CatalogFiltersInput } from "../types/catalog-filters.input";
import { Model } from "./model.model";
import { ModelService } from "./model.service";
import {User} from "../../users/user.model";
import {INormalizedGqlRequestedPaths, NormalizeGqlResolveInfo} from "../../common/utils/normalize-gql-resolve-info";

@Public()
@Resolver(() => Model)
export class ModelResolver {
  constructor(private readonly modelService: ModelService) {}

  @Query(() => [Model], { name: "models" })
  async getBrandModels(
    @CurrentUser() user: User,
    @NormalizeGqlResolveInfo.RequestedPaths()
      requestedPaths: INormalizedGqlRequestedPaths,
    @Args("filters", { nullable: true }) filters?: CatalogFiltersInput
  ): Promise<Model[]> {
    return this.modelService.findAll(user, requestedPaths, filters);
  }
}
