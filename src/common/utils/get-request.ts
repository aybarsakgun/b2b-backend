import {ExecutionContext} from "@nestjs/common";
import {GqlExecutionContext} from "@nestjs/graphql";

export function getRequest(context: ExecutionContext) {
  if (context.getType() === "http") {
    return context.switchToHttp().getRequest();
  }
  return GqlExecutionContext.create(context).getContext().req;
}
