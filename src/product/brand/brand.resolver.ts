import { Args, Query, Resolver } from "@nestjs/graphql";
import { Public } from "../../common/decorators";
import { Brand } from "./brand.model";
import { BrandService } from "./brand.service";
import { CatalogFiltersInput } from "../types/catalog-filters.input";

@Public()
@Resolver(() => Brand)
export class BrandResolver {
  constructor(private readonly brandService: BrandService) {}

  @Query(() => [Brand], { name: "brands" })
  async getBrands(
    @Args("filters", { nullable: true }) filters?: CatalogFiltersInput
  ): Promise<Brand[]> {
    return this.brandService.findAll(filters);
  }
}
