import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./user.model";
import { IPaginationInput } from "../modules/pagination/interfaces/pagination-input.interface";
import { IPaginationResult } from "../modules/pagination/interfaces/pagination-result.interface";
import { PaginationService } from "../modules/pagination/pagination.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private paginationService: PaginationService
  ) {}

  async findById(id: number): Promise<User> {
    if (!id) {
      throw new NotFoundException();
    }
    const findUser = await this.userRepository.findOne(id, {
      relations: ["branches", "salesRepresentative"],
    });
    if (!findUser) {
      throw new NotFoundException();
    }
    return findUser;
  }

  async findAll(
    paginationInput: IPaginationInput
  ): Promise<IPaginationResult<User>> {
    return this.paginationService.paginate<User>(
      this.userRepository.createQueryBuilder("user"),
      paginationInput
    );
  }
}
