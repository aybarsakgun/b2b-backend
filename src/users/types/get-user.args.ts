import { ArgsType, Field, ID } from "@nestjs/graphql";
import {IsNotEmpty, IsNumber, IsUUID} from "class-validator";

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
