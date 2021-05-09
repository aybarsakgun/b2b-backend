import { EntityRepository } from "typeorm";
import { Product } from "./product.model";
import { BaseRepository } from "../common/repositories/base.repository";

@EntityRepository(Product)
export class ProductRepository extends BaseRepository<Product> {}
