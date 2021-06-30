import {EntityRepository} from "typeorm";
import {BaseRepository} from "../../common/repositories/base.repository";
import {ICatalogFilters} from "../interfaces/catalog-filters.interface";
import {Category} from "./category.model";
import {INormalizedGqlRequestedPaths} from "../../common/utils/normalize-gql-resolve-info";
import {ProductUtil} from "../product.util";
import {Currency} from "../../currency/currency.model";
import {User} from "../../users/user.model";

@EntityRepository(Category)
export class CategoryRepository extends BaseRepository<Category> {
  findByFilters(
    filters: ICatalogFilters,
    requestedPaths: INormalizedGqlRequestedPaths,
    currency: Currency,
    user: User
  ): Promise<Category[]> {
    const queryBuilder = this.createQueryBuilder(requestedPaths.root);

    if (Object.keys(filters).length) {
      queryBuilder.addSelect(
        "COUNT(DISTINCT product.id)",
        `${requestedPaths.root}_product_count`
      )
        .leftJoinAndSelect(`${requestedPaths.root}.products`, "product");

      if (filters?.brands?.length) {
        queryBuilder
          .leftJoinAndSelect("product.brand", "brand")
          .andWhere(`brand.id IN (:brands)`, {
          brands: filters.brands,
        });
      }

      if (filters?.models?.length) {
        queryBuilder
          .leftJoinAndSelect("product.model", "model")
          .andWhere(`model.id IN (:models)`, {
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

      if (filters?.priceRange) {
        ProductUtil.setPriceRangeFilter<Category>(
          filters.priceRange,
          queryBuilder,
          'product',
          user,
          currency
        );
      }

      queryBuilder.groupBy(`${requestedPaths.root}.id`);
    }

    queryBuilder.orderBy(`${requestedPaths.root}.name`, 'ASC');

    return this.getPopulatedQuery(requestedPaths, queryBuilder).getMany();
  }
}
