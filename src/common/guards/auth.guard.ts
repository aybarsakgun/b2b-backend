import {ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {AuthGuard} from "@nestjs/passport";
import {getRequest} from "../utils/get-request";
import {TokenExpiredError} from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  getRequest(context: ExecutionContext) {
    return getRequest(context);
  }

  handleRequest(err, user, info, context) {
    const isPublic = this.reflector.getAllAndOverride<boolean>('public', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (user) {
      return user;
    }
    if (isPublic) {
      return true;
    }
    if (info instanceof TokenExpiredError) {
      throw new TokenExpiredError('MAIN.TOKEN_EXPIRED', info.expiredAt);
    }
    throw new UnauthorizedException('MAIN.UNAUTHORIZED');
  }
}
