import {Field, ID, InputType} from "@nestjs/graphql";
import {IsArray, IsOptional} from "class-validator";
import {PriceRangeInput} from "./price-range.input";
import {IPriceRange} from "../../common/interfaces/price-range.interface";

@InputType()
export class CatalogFiltersInput {
  @Field(() => [ID], {nullable: true})
  @IsOptional()
  @IsArray()
  brands: number[];

  @Field(() => [ID], {nullable: true})
  @IsOptional()
  @IsArray()
  models: number[];

  @Field(() => ID, {nullable: true})
  @IsOptional()
  category: number;

  @Field(() => PriceRangeInput, {nullable: true})
  @IsOptional()
  priceRange: IPriceRange;
}
