import {CanActivate, ExecutionContext, Injectable,} from "@nestjs/common";
import {UserRole} from "../../users/user.model";
import {getRequest} from "../utils/get-request";
import {AuthGuard} from "./auth.guard";
import {Reflector} from "@nestjs/core";
import {AuthService} from "../../auth/auth.service";

@Injectable()
export class AdminGuard extends AuthGuard implements CanActivate {
  constructor(
    protected readonly reflector: Reflector,
    protected readonly authService: AuthService
  ) {
    super(reflector, authService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = getRequest(context);

    // if (!req.user) {
    //   return false;
    // }

    return req.user.role === UserRole.ADMIN;
  }
}
