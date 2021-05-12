import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {GqlExecutionContext} from "@nestjs/graphql";
import {GraphQLResolveInfo} from "graphql";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const isHttp = context.getType() === 'http';
    const field = isHttp ? context.switchToHttp().getRequest().route.path : GqlExecutionContext.create(context).getInfo<GraphQLResolveInfo>().fieldName;
    return next
      .handle()
      .pipe(
        tap(() => console.log(`${isHttp ? 'Request path to:' : 'Request for graphql query:'} ${field} Response timer: ${Date.now() - now}ms`)),
      );
  }
}
