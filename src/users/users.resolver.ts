import { Args, Query, Resolver } from "@nestjs/graphql";
import { UserId } from "../common/decorators";
import { GetUserArgs } from "./dto/get-user.args";
import { GetUsersArgs } from "./dto/get-users.args";
import { User } from "./user.model";
import { UsersService } from "./users.service";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { name: "user" })
  async getUser(@Args() args: GetUserArgs): Promise<User> {
    return this.usersService.findById(args.id);
  }

  @Query(() => User, { name: "me" })
  async getMe(@UserId() userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }

  @Query(() => [User], { name: "users" })
  async getUsers(@Args() args?: GetUsersArgs): Promise<User[]> {
    return this.usersService.findAll(args);
  }
}
