import { EntityRepository } from "typeorm";
import { BaseRepository } from "../../common/repositories/base.repository";
import { ICatalogFilters } from "../interfaces/catalog-filters.interface";
import { Model } from "./model.model";

@EntityRepository(Model)
export class ModelRepository extends BaseRepository<Model> {
  findByBrandWithFilters(filters: ICatalogFilters): Promise<Model[]> {
    const queryBuilder = this.createQueryBuilder("model")
      .addSelect("COUNT(DISTINCT product.id)", "model_product_count")
      .leftJoinAndSelect("model.brand", "brand")
      .leftJoinAndSelect("model.products", "product")
      .leftJoinAndSelect("product.categories", "category");

    if (filters?.brands?.length) {
      queryBuilder.andWhere(`brand.id IN (:brands)`, {
        brands: filters.brands,
      });
    }

    // if (filters?.models?.length) {
    //   queryBuilder.andWhere(`model.id IN (:models)`, {
    //     models: filters.models,
    //   });
    // }

    if (filters?.category) {
      queryBuilder.andWhere(`category.id = :category`, {
        category: filters.category,
      });
    }

    queryBuilder.groupBy("model.id");

    return queryBuilder.getMany();
  }
}
