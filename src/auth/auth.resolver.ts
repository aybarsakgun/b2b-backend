import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { Public } from "../common/decorators";
import { AuthService } from "./auth.service";
import { LoginInput } from "./types/login.input";
import { LoginResult } from "./types/login-result";

@Resolver()
@Public()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LoginResult)
  async login(@Args("data") input: LoginInput): Promise<LoginResult> {
    return await this.authService.login(input);
  }
}
