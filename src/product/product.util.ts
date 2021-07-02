import {User} from "../users/user.model";
import {INormalizedGqlRequestedPaths} from "../common/utils/normalize-gql-resolve-info";
import {IPriceRange} from "../common/interfaces/price-range.interface";
import {SelectQueryBuilder} from "typeorm";
import {Currency} from "../currency/currency.model";
import {CatalogSortingField} from "./types/catalog-sorting.input";

export class ProductUtil {
  static fillJoinCondition = (user: User) => {
    return (parent: string, child: string) => {
      if (child === 'defaultPrice') {
        return `${parent}__${child}.priceOrder = ${user?.priceOrder ?? parent + '.defaultPriceOrder'}`;
      } else if (child === 'listPrice') {
        return `${parent}__${child}.priceOrder = ${parent + '.listPriceOrder'}`;
      } else if (child === 'units') {
        return `${parent}__${child}.value = ${parent + '.defaultUnit'}`;
      }
    }
  };

  static isThisRelationRequested = (requestedPaths: INormalizedGqlRequestedPaths, relationName: string) => {
    if (!requestedPaths) {
      return false;
    }
    return requestedPaths.relations.find((relation) =>
      relation.includes(relationName)
    );
  };

  static setPriceRangeFilter = <T>(
    priceRangeFilter: IPriceRange,
    queryBuilder: SelectQueryBuilder<T>,
    alias: string,
    user: User,
    currency: Currency,
    requestedPaths?: INormalizedGqlRequestedPaths
  ) => {
    if (!ProductUtil.isThisRelationRequested(requestedPaths, 'units')) {
      queryBuilder.leftJoinAndSelect(
        `${alias}.units`,
        `${alias}__units`,
        ProductUtil.fillJoinCondition(user)(alias, 'units')
      );
    }
    if (!ProductUtil.isThisRelationRequested(requestedPaths, 'defaultPrice')) {
      queryBuilder.leftJoinAndSelect(
        `${alias}__units.prices`,
        `${alias}__units__defaultPrice`,
        ProductUtil.fillJoinCondition(user)(alias + '__units', 'defaultPrice')
      );
    }
    if (!ProductUtil.isThisRelationRequested(requestedPaths, 'listPrice')) {
      queryBuilder.leftJoinAndSelect(
        `${alias}__units.prices`,
        `${alias}__units__listPrice`,
        ProductUtil.fillJoinCondition(user)(alias + '__units', 'listPrice')
      );
    }
    queryBuilder.leftJoinAndSelect('currency',
      `currencies`,
      `${alias}__units__defaultPrice.currency = currencies.code`
    );
    const {min, max, vatIncluded} = priceRangeFilter;
    if (max == null && parseFloat(min) > 0) {
      queryBuilder.andWhere(`(${alias + '__units__defaultPrice'}.value * currencies.exchangeRate) / (${currency.exchangeRate} * ((100 + ${vatIncluded ? alias + '.taxRate' : 0}) / 100)) >= :min`, {
        min
      });
    } else if (min == null && parseFloat(max) > 0) {
      queryBuilder.andWhere(`(${alias + '__units__defaultPrice'}.value * currencies.exchangeRate) / (${currency.exchangeRate} * ((100 + ${vatIncluded ? alias + '.taxRate' : 0}) / 100)) <= :max`, {
        max
      });
    } else if (parseFloat(min) > 0 && parseFloat(max) > 0) {
      queryBuilder
        .andWhere(`(${alias + '__units__defaultPrice'}.value * currencies.exchangeRate) / (${currency.exchangeRate} * ((100 + ${vatIncluded ? alias + '.taxRate' : 0}) / 100)) <= :max`, {
          max,
        })
        .andWhere(`(${alias + '__units__defaultPrice'}.value * currencies.exchangeRate) / (${currency.exchangeRate} * ((100 + ${vatIncluded ? alias + '.taxRate' : 0}) / 100)) >= :min`, {
          min
        });
    }
    return queryBuilder;
  };

  static generateSortingFieldString = (productJoinAlias: string, field: CatalogSortingField) => {
    switch (field) {
      case CatalogSortingField.PRODUCT_NAME:
        return productJoinAlias + '.name';
      case CatalogSortingField.PRODUCT_PRICE:
        return productJoinAlias + '__units__defaultPrice.value';
      case CatalogSortingField.PRODUCT_QUANTITY:
        return productJoinAlias + '.quantity';
      case CatalogSortingField.PRODUCT_BRAND:
        return productJoinAlias + '__brand.name';
    }
  };

  static setSearchTermFilter = <T>(
    searchTerm: string,
    queryBuilder: SelectQueryBuilder<T>,
    alias: string
  ) => {
    searchTerm.split(' ').forEach((word, index) => {
      queryBuilder.andWhere(`${alias}.name LIKE :search_${index} OR ${alias}.code LIKE :search_${index} OR ${alias}.equivalentCode LIKE :search_${index} OR ${alias}__units.barcode LIKE :search_${index}`, {
        ['search_' + index]: `%${word}%`
      });
    });
    return queryBuilder;
  };
}
