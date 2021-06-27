import {Injectable} from "@nestjs/common";
import {IPaginationInput} from "../modules/pagination/interfaces/pagination-input.interface";
import {IPaginationResult} from "../modules/pagination/interfaces/pagination-result.interface";
import {PaginationService} from "../modules/pagination/pagination.service";
import {ProductRepository} from "./product.repository";
import {Product} from "./product.model";
import {INormalizedGqlRequestedPaths} from "../common/utils/normalize-gql-resolve-info";
import {ICatalogFilters} from "./interfaces/catalog-filters.interface";
import {User} from "../users/user.model";
import {CurrencyService} from "../currency/currency.service";

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly paginationService: PaginationService,
    private readonly currencyService: CurrencyService
  ) {
  }

  async findById(
    requestedPaths: INormalizedGqlRequestedPaths,
    id: string
  ): Promise<Product> {
    if (!id) {
      return null;
    }
    return await this.productRepository
      .getPopulatedQuery(requestedPaths)
      .where(`${requestedPaths.root}.id = :id`, {id})
      .getOne();
  }

  async findAll(
    user: User,
    requestedPaths: INormalizedGqlRequestedPaths,
    paginationInput: IPaginationInput,
    filters: ICatalogFilters
  ): Promise<IPaginationResult<Product>> {
    let currency = null;
    if (filters?.priceRange) {
      currency = await this.currencyService.findByCode(filters.priceRange.currency);
    }
    return this.paginationService.paginate<Product>(
      this.productRepository.findByFilters(filters, requestedPaths, currency, user),
      paginationInput,
      // ProductMapper.mapByUser(user)
    );
  }
}
