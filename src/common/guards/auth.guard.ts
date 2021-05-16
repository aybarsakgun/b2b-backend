import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {getRequest} from "../utils/get-request";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {

  }

  canActivate(
    context: ExecutionContext
  ): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>("public", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = getRequest(context);

    if (!req.user) {
      throw new UnauthorizedException('MAIN.UNAUTHORIZED');
    }

    return true;
  }
}
