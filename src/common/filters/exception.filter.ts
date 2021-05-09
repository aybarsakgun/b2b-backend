import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { GqlExceptionFilter } from "@nestjs/graphql";

@Catch(HttpException)
export class AnyExceptionFilter implements ExceptionFilter, GqlExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const statusCode = exception.getStatus();
    if (host.getType() === "http") {
      const response = host.switchToHttp().getResponse();
      const exceptionResponse: any = exception.getResponse();
      response.status(statusCode).json(<any>{
        statusCode,
        timestamp: new Date().toISOString(),
        messages: exceptionResponse.message
          ? Array.isArray(exceptionResponse.message)
            ? exceptionResponse["message"]
            : [exceptionResponse["message"]]
          : [exceptionResponse],
      });
    }
  }
}
