import {Field, InputType, Int} from "@nestjs/graphql";
import {IsNotEmpty, IsNumber, IsOptional} from "class-validator";

@InputType()
export class AddItemToCartInput {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @Field(() => Int, {nullable: true})
  @IsNumber()
  @IsOptional()
  quantity?: number;
}
