import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "../users/user.repository";
import {AuthResolver} from "./auth.resolver";
import {AuthService} from "./auth.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository])
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService]
})
export class AuthModule {
}
