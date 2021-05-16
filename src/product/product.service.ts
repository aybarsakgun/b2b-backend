import { Injectable } from "@nestjs/common";
import { IPaginationInput } from "../modules/pagination/interfaces/pagination-input.interface";
import { IPaginationResult } from "../modules/pagination/interfaces/pagination-result.interface";
import { PaginationService } from "../modules/pagination/pagination.service";
import { ProductRepository } from "./product.repository";
import { Product } from "./product.model";
import { INormalizedGqlRequestedPaths } from "../common/utils/normalize-gql-resolve-info";
import { ICatalogFilters } from "./interfaces/catalog-filters.interface";
import {ProductPrice} from "./product-price/product-price.model";
import {User} from "../users/user.model";

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private paginationService: PaginationService
  ) {}

  async findById(
    requestedPaths: INormalizedGqlRequestedPaths,
    id: string
  ): Promise<Product> {
    if (!id) {
      return null;
    }
    return await this.productRepository
      .getPopulatedQuery(requestedPaths)
      .where(`${requestedPaths.root}.id = :id`, { id })
      .getOne();
  }

  async findAll(
    user: User,
    requestedPaths: INormalizedGqlRequestedPaths,
    paginationInput: IPaginationInput,
    filters: ICatalogFilters
  ): Promise<IPaginationResult<Product>> {
    return this.paginationService.paginate<Product>(
      this.productRepository.findByFilters(filters, requestedPaths),
      paginationInput,
      (item) => {
        return {
          ...item,
          units: item.units?.map(unit => {
            const defaultPriceOrder: number = user?.priceOrder || unit.defaultPriceOrder;
            return {
              ...unit,
              defaultPriceOrder: defaultPriceOrder,
              prices: unit.prices?.filter(price => price.priceOrder === defaultPriceOrder || price.priceOrder === unit.listPriceOrder) || []
            }
          }) || []
        }
      }
    );
  }
}
