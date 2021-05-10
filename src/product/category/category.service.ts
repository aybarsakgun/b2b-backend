import { Injectable } from "@nestjs/common";
import { ICatalogFilters } from "../interfaces/catalog-filters.interface";
import { Category } from "./category.model";
import { CategoryRepository } from "./category.repository";
import { INormalizedGqlRequestedPaths } from "../../common/utils/normalize-gql-resolve-info";

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll(
    requestedPaths: INormalizedGqlRequestedPaths,
    filters: ICatalogFilters
  ): Promise<Category[]> {
    return await this.categoryRepository.findByFilters(filters, requestedPaths);
  }
}
