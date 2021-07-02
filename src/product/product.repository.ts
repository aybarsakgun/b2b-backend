import {EntityRepository, Like, SelectQueryBuilder} from "typeorm";
import {Product} from "./product.model";
import {BaseRepository} from "../common/repositories/base.repository";
import {INormalizedGqlRequestedPaths} from "../common/utils/normalize-gql-resolve-info";
import {Currency} from "../currency/currency.model";
import {User} from "../users/user.model";
import {ICatalogFilters} from "./interfaces/catalog-filters.interface";
import {ProductUtil} from "./product.util";
import {ICatalogSorting} from "./interfaces/catalog-sorting.interface";
import {BadRequestException} from "@nestjs/common";

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {
  findByFilters(
    filters: ICatalogFilters,
    sorting: ICatalogSorting,
    requestedPaths: INormalizedGqlRequestedPaths,
    currency: Currency,
    user: User
  ): SelectQueryBuilder<Product> {
    const queryBuilder = this.createQueryBuilder(requestedPaths.root);

    if (filters?.brands?.length) {
      if (!ProductUtil.isThisRelationRequested(requestedPaths, 'brand')) {
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
      if (!ProductUtil.isThisRelationRequested(requestedPaths, 'model')) {
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
      if (!ProductUtil.isThisRelationRequested(requestedPaths, 'categories')) {
        queryBuilder.leftJoinAndSelect(
          `${requestedPaths.root}.categories`,
          `${requestedPaths.root}__categories`
        );
      }
      queryBuilder.andWhere(
        `${requestedPaths.root}__categories.id = :category`,
        {category: filters.category}
      );
    }

    this.getPopulatedQuery(requestedPaths, queryBuilder, ProductUtil.fillJoinCondition(user));

    if (filters?.priceRange) {
      ProductUtil.setPriceRangeFilter<Product>(
        filters.priceRange,
        queryBuilder,
        requestedPaths.root,
        user,
        currency,
        requestedPaths
      );
    }

    if (filters?.searchTerm) {
      ProductUtil.setSearchTermFilter<Product>(
        filters.searchTerm,
        queryBuilder,
        requestedPaths.root
      );
    }

    queryBuilder.orderBy(ProductUtil.generateSortingFieldString(requestedPaths.root, sorting.field), sorting.order);

    return queryBuilder;
  }
}
