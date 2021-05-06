import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { User } from "./user.model";
import {IPaginationInput} from "../modules/pagination/interfaces/pagination-input.interface";
import {IPaginationResult} from "../modules/pagination/interfaces/pagination-result.interface";
import {PaginationService} from "../modules/pagination/pagination.service";

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private paginationService: PaginationService
  ) {}

  async findById(id: string): Promise<User> {
    if (!id) {
      return null;
    }
    return await this.userRepository.findOne(id);
  }

  async findAll(paginationInput: IPaginationInput): Promise<IPaginationResult<User>> {
    return this.paginationService.paginate<User>(
      this.userRepository.createQueryBuilder('user'),
      paginationInput,
    )
  }
}
