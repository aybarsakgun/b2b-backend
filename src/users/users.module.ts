import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UserRepository } from "./user.repository";
import { UsersResolver } from "./users.resolver";
import { UsersService } from "./users.service";
import { UserController } from "./user.controller";

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [UsersResolver, UsersService],
  controllers: [UserController],
})
export class UsersModule {}
