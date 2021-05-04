import {Injectable, UnauthorizedException} from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "../common/env";
import {IJwtPayload} from "../common/interfaces/jwt-payload.interface";
import {AuthService} from "./auth.service";
import {User} from "../users/user.model";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET
    });
  }

  async validate(payload: IJwtPayload): Promise<User> {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
