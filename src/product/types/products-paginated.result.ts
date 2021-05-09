import { ObjectType } from "@nestjs/graphql";
import { PaginatedTypeCreator } from "../../modules/pagination/utils/paginated-type-creator";
import { Product } from "../product.model";

@ObjectType()
export class ProductsPaginatedResult extends PaginatedTypeCreator(Product) {}
