import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import { UserController } from "./user.controller";
import {PaginationModule} from "../modules/pagination/pagination.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), PaginationModule],
  providers: [UsersResolver, UsersService],
  controllers: [UserController],
})
export class UsersModule {}
