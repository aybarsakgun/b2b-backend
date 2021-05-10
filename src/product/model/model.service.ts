import { Injectable } from "@nestjs/common";
import { ICatalogFilters } from "../interfaces/catalog-filters.interface";
import { ModelRepository } from "./model.repository";
import { Model } from "./model.model";

@Injectable()
export class ModelService {
  constructor(private readonly modelRepository: ModelRepository) {}

  async findAll(filters: ICatalogFilters): Promise<Model[]> {
    return await this.modelRepository.findByBrandWithFilters(filters);
  }
}
