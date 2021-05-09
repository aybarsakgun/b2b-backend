import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaginationModule } from "../modules/pagination/pagination.module";
import { ProductRepository } from "./product.repository";
import { ProductResolver } from "./product.resolver";
import { ProductService } from "./product.service";
import {BrandRepository} from "./brand/brand.repository";
import {BrandService} from "./brand/brand.service";
import {BrandResolver} from "./brand/brand.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductRepository,
      BrandRepository
    ]),
    PaginationModule
  ],
  providers: [
    ProductResolver,
    ProductService,
    BrandResolver,
    BrandService
  ],
})
export class ProductModule {}
