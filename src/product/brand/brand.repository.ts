import {EntityRepository} from "typeorm";
import {Brand} from "./brand.model";
import {BaseRepository} from "../../common/repositories/base.repository";
import {ICatalogFilters} from "../interfaces/catalog-filters.interface";
import {INormalizedGqlRequestedPaths} from "../../common/utils/normalize-gql-resolve-info";
import {Currency} from "../../currency/currency.model";
import {User} from "../../users/user.model";
import {ProductUtil} from "../product.util";

@EntityRepository(Brand)
export class BrandRepository extends BaseRepository<Brand> {
  findByFilters(
    filters: ICatalogFilters,
    requestedPaths: INormalizedGqlRequestedPaths,
    currency: Currency,
    user: User
  ): Promise<Brand[]> {
    const queryBuilder = this.createQueryBuilder(requestedPaths.root);

    if (Object.keys(filters).length) {
      queryBuilder
        .addSelect("COUNT(DISTINCT product.id)", `${requestedPaths.root}_product_count`)
        .leftJoinAndSelect(`${requestedPaths.root}.products`, "product");

      if (filters?.models?.length) {
        if (!ProductUtil.isThisRelationRequested(requestedPaths, 'models')) {
          queryBuilder.leftJoinAndSelect(`${requestedPaths.root}.models`, `${requestedPaths.root}__models`);
        }
        queryBuilder.andWhere(`${requestedPaths.root}__models.id IN (:models)`, {
          models: filters.models
        });
      }

      if (filters?.category) {
        queryBuilder
          .leftJoinAndSelect("product.categories", "category")
          .andWhere(`category.id = :category`, {
            category: filters.category
          });
      }

      if (filters?.priceRange) {
        ProductUtil.setPriceRangeFilter<Brand>(
          filters.priceRange,
          queryBuilder,
          'product',
          user,
          currency
        );
      }

      if (filters?.searchTerm) {
        ProductUtil.setSearchTermFilter<Brand>(
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
