import {EntityRepository} from "typeorm";
import {BaseRepository} from "../../common/repositories/base.repository";
import {ICatalogFilters} from "../interfaces/catalog-filters.interface";
import {Model} from "./model.model";
import {INormalizedGqlRequestedPaths} from "../../common/utils/normalize-gql-resolve-info";
import {Currency} from "../../currency/currency.model";
import {User} from "../../users/user.model";
import {ProductUtil} from "../product.util";

@EntityRepository(Model)
export class ModelRepository extends BaseRepository<Model> {
  findByBrandWithFilters(
    filters: ICatalogFilters,
    requestedPaths: INormalizedGqlRequestedPaths,
    currency: Currency,
    user: User
  ): Promise<Model[]> {
    const queryBuilder = this.createQueryBuilder(requestedPaths.root);

    if (Object.keys(filters).length) {
      queryBuilder
        .addSelect("COUNT(DISTINCT product.id)", `${requestedPaths.root}_product_count`)
        .leftJoinAndSelect(`${requestedPaths.root}.products`, "product");

      if (filters?.brands?.length) {
        if (!ProductUtil.isThisRelationRequested(requestedPaths, 'brand')) {
          queryBuilder.leftJoinAndSelect(`${requestedPaths.root}.brand`, `${requestedPaths.root}__brand`);
        }
        queryBuilder.andWhere(`${requestedPaths.root}__brand.id IN (:brands)`, {
          brands: filters.brands
        });
      }

      if (filters?.category) {
        queryBuilder
          .leftJoinAndSelect("product.categories", "category")
          .andWhere(`category.id = :category`, {
            category: filters.category,
          });
      }

      if (filters?.priceRange) {
        ProductUtil.setPriceRangeFilter<Model>(
          filters.priceRange,
          queryBuilder,
          'product',
          user,
          currency
        );
      }

      if (filters?.searchTerm) {
        ProductUtil.setSearchTermFilter<Model>(
          filters.searchTerm,
          queryBuilder,
          'product'
        );
      }

      queryBuilder.groupBy(`${requestedPaths.root}.id`);
    }

    queryBuilder.orderBy(`${requestedPaths.root}.name`, 'ASC');

    return this.getPopulatedQuery(requestedPaths, queryBuilder).getMany();
  }
}
