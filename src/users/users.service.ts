import { Injectable } from "@nestjs/common";
import { brackets } from "../common/utils";
import { GetUsersArgs } from "./dto/get-users.args";
import { UserRepository } from "./user.repository";
import { User } from "./user.model";

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<User> {
    if (!id) {
      return null;
    }
    return await this.userRepository.findOne(id);
  }

  async findAll({
    role,
    search,
    ids,
    withDeleted,
  }: GetUsersArgs): Promise<User[]> {
    const query = this.userRepository.createQueryBuilder("user");

    if (ids && ids.length) {
      query.andWhereInIds(ids);
    }

    if (role) {
      query.andWhere("user.role = :role", { role });
    }

    if (search) {
      const searchQuery = brackets(
        ["user.name LIKE :search", "user.email LIKE :search"].join(" OR ")
      );
      query.andWhere(searchQuery, { search: `%${search}%` });
    }

    if (withDeleted) {
      query.withDeleted();
    }

    query.orderBy("user.name", "ASC");

    return query.getMany();
  }
}
