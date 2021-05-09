import { Args, Query, Resolver } from "@nestjs/graphql";
import { GetUserArgs } from "./types/get-user.args";
import { User } from "./user.model";
import { UsersService } from "./users.service";
import { PaginationInput } from "../modules/pagination/types/pagination.input";
import { UserPaginatedResult } from "./types/user-paginated.result";
import { IPaginationResult } from "../modules/pagination/interfaces/pagination-result.interface";
import { CurrentUser } from "../common/decorators";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: "user" })
  async getUser(@Args() args: GetUserArgs): Promise<User> {
    return this.usersService.findById(args.id);
  }

  @Query(() => User, { name: "me", nullable: true })
  async getMe(@CurrentUser() user: User): Promise<User> {
    return this.usersService.findById(user?.id);
  }

  @Query(() => UserPaginatedResult, { name: "users" })
  async getUsers(
    @Args("pagination", { nullable: true }) pagination?: PaginationInput
  ): Promise<IPaginationResult<User>> {
    return this.usersService.findAll(pagination);
  }
}
