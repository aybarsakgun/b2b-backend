import {Args, Query, Resolver} from "@nestjs/graphql";
import {Public} from "../../common/decorators";
import {CatalogFiltersInput} from "../types/catalog-filters.input";
import {Model} from "./model.model";
import {ModelService} from "./model.service";

@Public()
@Resolver(() => Model)
export class ModelResolver {
  constructor(
    private readonly modelService: ModelService
  ) {
  }

  @Query(() => [Model], {name: "models"})
  async getBrandModels(
    @Args("filters", {nullable: true}) filters?: CatalogFiltersInput
  ): Promise<Model[]> {
    return this.modelService.findAll(filters);
  }
}
