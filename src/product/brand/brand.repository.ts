import {EntityRepository} from "typeorm";
import {Brand} from "./brand.model";
import {BaseRepository} from "../../common/repositories/base.repository";
import {ICatalogFilters} from "../interfaces/catalog-filters.interface";

@EntityRepository(Brand)
export class BrandRepository extends BaseRepository<Brand> {
  findByFilters(filters: ICatalogFilters): Promise<Brand[]> {
    const queryBuilder = this.createQueryBuilder('brand')
      .addSelect('COUNT(DISTINCT product.id)', 'brand_product_count')
      .leftJoinAndSelect('brand.products', 'product')
      .leftJoinAndSelect('brand.models', 'model')
      .leftJoinAndSelect('product.categories', 'category');

    if (filters?.brands?.length) {
      queryBuilder.andWhere(`brand.id IN (:brands)`, {brands: filters.brands});
    }

    if (filters?.models?.length) {
      queryBuilder.andWhere(`model.id IN (:models)`, {models: filters.models});
    }

    if (filters?.category) {
      queryBuilder.andWhere(`category.id = :category`, {category: filters.category});
    }

    queryBuilder.groupBy('brand.id');

    return queryBuilder.getMany();
  }
}
