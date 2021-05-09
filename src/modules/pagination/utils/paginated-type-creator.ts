import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";
import { IPaginationResult } from "../interfaces/pagination-result.interface";

export function paginatedTypeCreator<T>(classRef: Type<T>): any {
  @ObjectType(`${classRef.name}PaginatedResult`)
  abstract class PaginatedResult implements IPaginationResult<T> {
    @Field(() => Int, { nullable: true })
    total: number;

    @Field(() => Int, { nullable: true })
    totalPage: number;

    @Field(() => Int, { nullable: true })
    page: number;

    @Field(() => Int, { nullable: true })
    limit: number;

    @Field(() => [classRef])
    items: T[];
  }
  return PaginatedResult;
}
