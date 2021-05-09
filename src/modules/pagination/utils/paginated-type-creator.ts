import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";
import { IPaginationResult } from "../interfaces/pagination-result.interface";

export function PaginatedTypeCreator<T>(classRef: Type<T>): any {
  @ObjectType()
  abstract class PaginatedResultType implements IPaginationResult<T> {
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
  return PaginatedResultType;
}
