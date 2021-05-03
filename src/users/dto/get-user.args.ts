import { ArgsType, Field, ID } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID } from "class-validator";

@ArgsType()
export class GetUserArgs {
  @Field(() => ID)
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
