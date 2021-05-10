import {Injectable} from "@nestjs/common";
import {ICatalogFilters} from "../interfaces/catalog-filters.interface";
import {Brand} from "./brand.model";
import {BrandRepository} from "./brand.repository";

@Injectable()
export class BrandService {
  constructor(
    private readonly brandRepository: BrandRepository
  ) {
  }

  async findAll(
    filters: ICatalogFilters
  ): Promise<Brand[]> {
    return await this.brandRepository.findByFilters(filters);
  }
}
