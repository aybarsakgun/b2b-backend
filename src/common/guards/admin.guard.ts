import {CanActivate, ExecutionContext, Injectable,} from "@nestjs/common";
import {UserRole} from "../../users/user.model";
import {getRequest} from "../utils/get-request";

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = getRequest(context);

    if (!req.user) {
      return false;
    }

    return req.user.role === UserRole.ADMIN;
  }
}
