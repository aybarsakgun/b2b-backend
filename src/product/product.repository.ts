import {EntityRepository, SelectQueryBuilder} from "typeorm";
import {Product} from "./product.model";
import {BaseRepository} from "../common/repositories/base.repository";
import {INormalizedGqlRequestedPaths} from "../common/utils/normalize-gql-resolve-info";
import {Currency} from "../currency/currency.model";
import {User} from "../users/user.model";
import {ICatalogFilters} from "./interfaces/catalog-filters.interface";
import {ProductUtil} from "./product.util";

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {
  findByFilters(
    filters: ICatalogFilters,
    requestedPaths: INormalizedGqlRequestedPaths,
    currency: Currency,
    user: User
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
        {category: filters.category}
      );
    }

    this.getPopulatedQuery(requestedPaths, queryBuilder, ProductUtil.fillJoinCondition(user));

    if (filters?.priceRange) {
      if (!checkRelationRequested("units")) {
        queryBuilder.leftJoinAndSelect(
          `${requestedPaths.root}.units`,
          `${requestedPaths.root}__units`
        );
      }
      if (!checkRelationRequested("defaultPrice")) {
        queryBuilder.leftJoinAndSelect(
          `${requestedPaths.root}__units.prices`,
          `${requestedPaths.root}__units__defaultPrice`,
          ProductUtil.fillJoinCondition(user)(requestedPaths.root + '__units', 'defaultPrice')
        );
      }
      if (!checkRelationRequested("listPrice")) {
        queryBuilder.leftJoinAndSelect(
          `${requestedPaths.root}__units.prices`,
          `${requestedPaths.root}__units__listPrice`,
          ProductUtil.fillJoinCondition(user)(requestedPaths.root + '__units', 'listPrice')
        );
      }
      queryBuilder.leftJoinAndSelect('currency',
        `currencies`,
        `${requestedPaths.root}__units__defaultPrice.currency = currencies.code`
      );
      const {min, max, vatIncluded} = filters.priceRange;
      if (max == null && parseFloat(min) > 0) {
        queryBuilder.andWhere(`(${requestedPaths.root + '__units__defaultPrice'}.value * currencies.exchangeRate) / (${currency.exchangeRate} * ((100 + ${vatIncluded ? requestedPaths.root + '.taxRate' : 0}) / 100)) >= :min`, {
          min
        });
      } else if (min == null && parseFloat(max) > 0) {
        queryBuilder.andWhere(`(${requestedPaths.root + '__units__defaultPrice'}.value * currencies.exchangeRate) / (${currency.exchangeRate} * ((100 + ${vatIncluded ? requestedPaths.root + '.taxRate' : 0}) / 100)) <= :max`, {
          max
        });
      } else if (parseFloat(min) > 0 && parseFloat(max) > 0) {
        queryBuilder
          .andWhere(`(${requestedPaths.root + '__units__defaultPrice'}.value * currencies.exchangeRate) / (${currency.exchangeRate} * ((100 + ${vatIncluded ? requestedPaths.root + '.taxRate' : 0}) / 100)) <= :max`, {
            max,
          })
          .andWhere(`(${requestedPaths.root + '__units__defaultPrice'}.value * currencies.exchangeRate) / (${currency.exchangeRate} * ((100 + ${vatIncluded ? requestedPaths.root + '.taxRate' : 0}) / 100)) >= :min`, {
            min
          });
      }
    }
    // throw new BadRequestException(queryBuilder.getSql());
    // queryBuilder.orderBy(`${requestedPaths.root + '__units_default_price'}`, 'ASC');

    return queryBuilder;
  }
}
