import { ObjectType } from "@nestjs/graphql";
import { PaginatedTypeCreator } from "../../modules/pagination/utils/paginated-type-creator";
import { User } from "../user.model";

@ObjectType()
export class UserPaginatedResult extends PaginatedTypeCreator(User) {}
