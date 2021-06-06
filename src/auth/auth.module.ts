import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserRepository} from "../users/user.repository";
import {AuthResolver} from "./auth.resolver";
import {AuthService} from "./auth.service";
import {PassportModule} from "@nestjs/passport";
import {env} from "../common/env";
import {JwtStrategy} from "./strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    PassportModule.register({
      defaultStrategy: "jwt",
      session: false,
    }),
    JwtModule.register({
      secret: env.JWT_SECRET,
      signOptions: {
        expiresIn: env.JWT_EXPIRES_IN,
      },
    }),
  ],
  providers: [AuthResolver, AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {
}
