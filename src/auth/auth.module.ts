import {Global, Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "../users/user.repository";
import {AuthResolver} from "./auth.resolver";
import {AuthService} from "./auth.service";

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository])
  ],
  providers: [AuthResolver, AuthService],
  exports: [AuthService]
})
export class AuthModule {
}
