import {CanActivate, ExecutionContext, Injectable, UseGuards,} from "@nestjs/common";
import {getRepository} from "typeorm";
import {User, UserRole} from "../../users/user.model";
import {getRequest} from "../utils/get-request";

@Injectable()
export class IsAdmin implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = getRequest(context);
    const user: User = req.user;

    if (!user) {
      return false;
    }

    const userRecord = await getRepository(User).findOne(user.id);

    return userRecord.role === UserRole.ADMIN;
  }
}

export const AdminGuard = () => UseGuards(IsAdmin);
