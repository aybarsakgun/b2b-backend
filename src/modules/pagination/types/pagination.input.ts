import {Field, InputType, Int} from "@nestjs/graphql";
import {IsNumber, IsOptional} from "class-validator";
import {IPaginationInput} from "../interfaces/pagination-input.interface";

// export enum SortDirection {
//   DESC = "DESC",
//   ASC = "ASC",
// }
//
// registerEnumType(SortDirection, {
//   name: "SortDirection",
// });

@InputType()
export class PaginationInput implements IPaginationInput {
  @Field(() => Int, {defaultValue: 1})
  @IsNumber()
  @IsOptional()
  page?: number;

  @Field(() => Int, {defaultValue: 10})
  @IsNumber()
  @IsOptional()
  limit?: number;

  // @Field(() => SortDirection, {defaultValue: SortDirection.ASC})
  // @IsOptional()
  // sort?: SortDirection;
}
