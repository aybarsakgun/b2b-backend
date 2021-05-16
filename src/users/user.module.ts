import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserRepository } from "./user.repository";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { PaginationModule } from "../modules/pagination/pagination.module";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), PaginationModule],
  providers: [UserResolver, UserService],
})
export class UserModule {}
