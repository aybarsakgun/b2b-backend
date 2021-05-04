import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UseGuards,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { getRepository } from "typeorm";
import { User, UserRole } from "../../users/user.model";
import {IJwtPayload} from "../interfaces/jwt-payload.interface";

@Injectable()
export class IsAdmin implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    const payload: IJwtPayload = ctx.req?.user;

    if (!payload) {
      return false;
    }

    const userRecord = await getRepository(User).findOne(payload.id);

    return userRecord.role === UserRole.ADMIN;
  }
}

export const AdminGuard = () => UseGuards(IsAdmin);
