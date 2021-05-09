import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import {PaginationModule} from "../modules/pagination/pagination.module";
import {ProductRepository} from "./product.repository";
import {ProductResolver} from "./product.resolver";
import {ProductService} from "./product.service";

@Module({
  imports: [TypeOrmModule.forFeature([ProductRepository]), PaginationModule],
  providers: [ProductResolver, ProductService]
})
export class ProductModule {}
