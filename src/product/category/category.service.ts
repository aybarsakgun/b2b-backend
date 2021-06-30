import { Injectable } from "@nestjs/common";
import { ICatalogFilters } from "../interfaces/catalog-filters.interface";
import { Category } from "./category.model";
import { CategoryRepository } from "./category.repository";
import { INormalizedGqlRequestedPaths } from "../../common/utils/normalize-gql-resolve-info";
import {User} from "../../users/user.model";
import {CurrencyService} from "../../currency/currency.service";

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly currencyService: CurrencyService
  ) {}

  async findAll(
    user: User,
    requestedPaths: INormalizedGqlRequestedPaths,
    filters: ICatalogFilters
  ): Promise<Category[]> {
    let currency = null;
    if (filters?.priceRange) {
      currency = await this.currencyService.findByCode(filters.priceRange.currency);
    }
    return this.categoryRepository.findByFilters(filters, requestedPaths, currency, user);
  }
}
