import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {PaginationModule} from "../modules/pagination/pagination.module";
import {ProductRepository} from "./product.repository";
import {ProductResolver} from "./product.resolver";
import {ProductService} from "./product.service";
import {BrandRepository} from "./brand/brand.repository";
import {BrandService} from "./brand/brand.service";
import {BrandResolver} from "./brand/brand.resolver";
import {CategoryRepository} from "./category/category.repository";
import {CategoryResolver} from "./category/category.resolver";
import {CategoryService} from "./category/category.service";
import {ModelResolver} from "./model/model.resolver";
import {ModelService} from "./model/model.service";
import {ModelRepository} from "./model/model.repository";
import {CurrencyModule} from "../currency/currency.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRepository,
      BrandRepository,
      CategoryRepository,
      ModelRepository,
    ]),
    PaginationModule,
    CurrencyModule
  ],
  providers: [
    ProductResolver,
    ProductService,
    BrandResolver,
    BrandService,
    CategoryResolver,
    CategoryService,
    ModelResolver,
    ModelService
  ],
})
export class ProductModule {
}
