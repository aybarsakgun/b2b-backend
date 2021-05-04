import {Args, Query, Resolver} from "@nestjs/graphql";
import {UserId} from "../common/decorators";
import {GetUserArgs} from "./dto/get-user.args";
import {User} from "./user.model";
import {UsersService} from "./users.service";
import {PaginationInput} from "../modules/pagination/dto/pagination.input";
import {UserPaginatedResult} from "./dto/user-paginated.result";
import {IPaginationResult} from "../modules/pagination/interfaces/pagination-result.interface";

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {
  }

  @Query(() => User, {name: "user"})
  async getUser(@Args() args: GetUserArgs): Promise<User> {
    return this.usersService.findById(args.id);
  }

  @Query(() => User, {name: "me"})
  async getMe(@UserId() userId: string): Promise<User> {
    return this.usersService.findById(userId);
  }

  @Query(() => UserPaginatedResult, {name: "users"})
  async getUsers(@Args('pagination', {nullable: true}) pagination?: PaginationInput): Promise<IPaginationResult<User>> {
    return this.usersService.findAll(pagination);
  }
}
