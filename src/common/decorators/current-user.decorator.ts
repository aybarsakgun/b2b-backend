import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { getRequest } from "../utils/get-request";
import {User} from "../../users/user.model";

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const user = getRequest(context)?.user;
    return user && user instanceof User ? user : null;
  }
);
