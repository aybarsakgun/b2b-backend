import {Args, Query, Resolver} from "@nestjs/graphql";
import {CurrentUser, Public} from "../../common/decorators";
import {Brand} from "./brand.model";
import {BrandService} from "./brand.service";
import {CatalogFiltersInput} from "../types/catalog-filters.input";
import {User} from "../../users/user.model";
import {INormalizedGqlRequestedPaths, NormalizeGqlResolveInfo} from "../../common/utils/normalize-gql-resolve-info";

@Public()
@Resolver(() => Brand)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {
  }

  @Query(() => [Brand], {name: "brands"})
  async getBrands(
    @CurrentUser() user: User,
    @NormalizeGqlResolveInfo.RequestedPaths()
      requestedPaths: INormalizedGqlRequestedPaths,
    @Args("filters", {nullable: true}) filters?: CatalogFiltersInput
  ): Promise<Brand[]> {
    return this.brandService.findAll(user, requestedPaths, filters);
  }
}
