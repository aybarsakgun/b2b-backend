import { Field, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { User } from "../../users/user.model";

@ObjectType()
export class LoginResult {
  @Field()
  @IsNotEmpty()
  token: string;

  @Field(() => User)
  @IsNotEmpty()
  user: User;
}
