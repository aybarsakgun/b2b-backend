import { EntityRepository, SelectQueryBuilder } from "typeorm";
import { Product } from "./product.model";
import { BaseRepository } from "../common/repositories/base.repository";
import { ICatalogFilters } from "./interfaces/catalog-filters.interface";
import { INormalizedGqlRequestedPaths } from "../common/utils/normalize-gql-resolve-info";

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {
  findByFilters(
    filters: ICatalogFilters,
    requestedPaths: INormalizedGqlRequestedPaths
  ): SelectQueryBuilder<Product> {
    const queryBuilder = this.createQueryBuilder(requestedPaths.root);

    const checkRelationRequested = (name: string): string[] => {
      return requestedPaths.relations.find((relation) =>
        relation.includes(name)
      );
    };

    if (filters?.brands?.length) {
      if (!checkRelationRequested("brand")) {
        queryBuilder.leftJoinAndSelect(
          `${requestedPaths.root}.brand`,
          `${requestedPaths.root}__brand`
        );
      }
      queryBuilder.andWhere(`${requestedPaths.root}.brand.id IN (:brands)`, {
        brands: filters.brands,
      });
    }

    if (filters?.models?.length) {
      if (!checkRelationRequested("model")) {
        queryBuilder.leftJoinAndSelect(
          `${requestedPaths.root}.model`,
          `${requestedPaths.root}__model`
        );
      }
      queryBuilder.andWhere(`${requestedPaths.root}.model.id IN (:models)`, {
        models: filters.models,
      });
    }

    if (filters?.category) {
      if (!checkRelationRequested("categories")) {
        queryBuilder.leftJoinAndSelect(
          `${requestedPaths.root}.categories`,
          `${requestedPaths.root}__categories`
        );
      }
      queryBuilder.andWhere(
        `${requestedPaths.root}__categories.id = :category`,
        { category: filters.category }
      );
    }

    return this.getPopulatedQuery(requestedPaths, queryBuilder);
  }
}
