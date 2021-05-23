import {EntityRepository} from "typeorm";
import {BaseRepository} from "../../common/repositories/base.repository";
import {ICatalogFilters} from "../interfaces/catalog-filters.interface";
import {Category} from "./category.model";
import {INormalizedGqlRequestedPaths} from "../../common/utils/normalize-gql-resolve-info";

@EntityRepository(Category)
export class CategoryRepository extends BaseRepository<Category> {
  findByFilters(
    filters: ICatalogFilters,
    requestedPaths: INormalizedGqlRequestedPaths
  ): Promise<Category[]> {
    const queryBuilder = this.createQueryBuilder(requestedPaths.root);

    if (Object.keys(filters).length) {
      queryBuilder.addSelect(
        "COUNT(DISTINCT product.id)",
        `${requestedPaths.root}_product_count`
      )
        .leftJoinAndSelect(`${requestedPaths.root}.products`, "product")
        .leftJoinAndSelect("product.brand", "brand")
        .leftJoinAndSelect("product.model", "model");

      if (filters?.brands?.length) {
        queryBuilder.andWhere(`brand.id IN (:brands)`, {
          brands: filters.brands,
        });
      }

      if (filters?.models?.length) {
        queryBuilder.andWhere(`model.id IN (:models)`, {
          models: filters.models,
        });
      }

      if (filters?.category) {
        queryBuilder.andWhere(`${requestedPaths.root}.parent = :parent`, {
          parent: filters.category,
        });
      } else {
        queryBuilder.andWhere(`${requestedPaths.root}.parent is null`);
      }

      queryBuilder.groupBy(`${requestedPaths.root}.id`);
    }

    queryBuilder.orderBy(`${requestedPaths.root}.name`, 'ASC');

    return this.getPopulatedQuery(requestedPaths, queryBuilder).getMany();
  }
}
