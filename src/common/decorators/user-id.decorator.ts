import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export const UserId = createParamDecorator(
  (
    _: unknown,
    context: ExecutionContext
  ): {
    id: string;
  } => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user.id;
  }
);
