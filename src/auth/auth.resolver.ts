import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Public } from "../common/decorators";
import { AuthService } from "./auth.service";
import { SignInInput } from "./types/sign-in.input";
import { SignInResult } from "./types/sign-in-result";

@Resolver()
@Public()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => SignInResult)
  async signIn(@Args("data") input: SignInInput): Promise<SignInResult> {
    return await this.authService.signIn(input);
  }
}
