import {Injectable} from "@nestjs/common";
import {ICatalogFilters} from "../interfaces/catalog-filters.interface";
import {Brand} from "./brand.model";
import {BrandRepository} from "./brand.repository";
import {User} from "../../users/user.model";
import {CurrencyService} from "../../currency/currency.service";
import {INormalizedGqlRequestedPaths} from "../../common/utils/normalize-gql-resolve-info";

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository,
    private readonly currencyService: CurrencyService
  ) {
  }

  async findAll(
    user: User,
    requestedPaths: INormalizedGqlRequestedPaths,
    filters: ICatalogFilters
  ): Promise<Brand[]> {
    let currency = null;
    if (filters?.priceRange) {
      currency = await this.currencyService.findByCode(filters.priceRange.currency);
    }
    return this.brandRepository.findByFilters(filters, requestedPaths, currency, user);
  }
}
