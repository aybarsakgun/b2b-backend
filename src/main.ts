import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { env } from "./common/env";
import { helmetMiddleware, rateLimitMiddleware } from "./common/middlewares";
import { Logger } from "@nestjs/common";
import * as bodyParser from "body-parser";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: true,
  });

  app.use(helmetMiddleware);
  app.use(rateLimitMiddleware);

  app.use(bodyParser.json({ limit: "50mb" }));

  app.enableCors();

  app.useGlobalInterceptors(new LoggingInterceptor());

  await app.listen(env.PORT);

  Logger.log(`Server is listening on port ${env.PORT}`, "Bootstrap");
}

bootstrap();
