import { Injectable } from "@nestjs/common";
import { IPaginationInput } from "../modules/pagination/interfaces/pagination-input.interface";
import { IPaginationResult } from "../modules/pagination/interfaces/pagination-result.interface";
import { PaginationService } from "../modules/pagination/pagination.service";
import { ProductRepository } from "./product.repository";
import { Product } from "./product.model";
import { INormalizedGqlRequestedPaths } from "../common/utils/normalize-gql-resolve-info";

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
    requestedPaths: INormalizedGqlRequestedPaths,
    paginationInput: IPaginationInput
  ): Promise<IPaginationResult<Product>> {
    return this.paginationService.paginate<Product>(
      this.productRepository.getPopulatedQuery(requestedPaths),
      paginationInput
    );
  }
}
