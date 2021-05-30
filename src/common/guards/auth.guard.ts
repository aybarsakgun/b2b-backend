import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {getRequest} from "../utils/get-request";
import {User} from "../../users/user.model";
import {IJwtPayload} from "../interfaces";
import {verify} from "jsonwebtoken";
import {env} from "../env";
import {AuthService} from "../../auth/auth.service";
import {IRequestWithUser} from "../interfaces/request-with-user.interface";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly authService: AuthService
  ) {
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>("public", [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const req = getRequest(context) as IRequestWithUser;

    const bearerHeader = req.headers['authorization'];
    const accessToken = bearerHeader && bearerHeader.split(' ')[1];

    if (!bearerHeader || !accessToken) {
      return false;
    }

    let user: User;

    try {
      const payload: IJwtPayload = verify(accessToken, env.JWT_SECRET) as IJwtPayload;
      user = await this.authService.validateUser(payload);
    } catch (error) {
      throw new UnauthorizedException('AUTH.INVALID_CREDENTIALS');
    }

    req.user = user;

    return true;
  }
}
