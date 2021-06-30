import { Injectable } from "@nestjs/common";
import { ICatalogFilters } from "../interfaces/catalog-filters.interface";
import { ModelRepository } from "./model.repository";
import { Model } from "./model.model";
import {CurrencyService} from "../../currency/currency.service";
import {User} from "../../users/user.model";
import {INormalizedGqlRequestedPaths} from "../../common/utils/normalize-gql-resolve-info";

@Injectable()
export class ModelService {
  constructor(
    private readonly modelRepository: ModelRepository,
    private readonly currencyService: CurrencyService
  ) {}

  async findAll(
    user: User,
    requestedPaths: INormalizedGqlRequestedPaths,
    filters: ICatalogFilters
  ): Promise<Model[]> {
    let currency = null;
    if (filters?.priceRange) {
      currency = await this.currencyService.findByCode(filters.priceRange.currency);
    }
    return await this.modelRepository.findByBrandWithFilters(filters, requestedPaths, currency, user);
  }
}
