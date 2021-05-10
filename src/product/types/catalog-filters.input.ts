import { Field, ID, InputType } from "@nestjs/graphql";
import { IsArray, IsOptional } from "class-validator";

@InputType()
export class CatalogFiltersInput {
  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  brands: number[];

  @Field(() => [ID], { nullable: true })
  @IsOptional()
  @IsArray()
  models: number[];

  @Field(() => ID, { nullable: true })
  @IsOptional()
  category: number;
}
