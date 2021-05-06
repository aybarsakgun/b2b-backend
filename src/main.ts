import {NestFactory} from "@nestjs/core";
import {NestExpressApplication} from "@nestjs/platform-express";
import {AppModule} from "./app.module";
import {env} from "./common/env";
import {helmetMiddleware, rateLimitMiddleware} from "./common/middlewares";
import {Logger} from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmetMiddleware);
  app.use(rateLimitMiddleware);

  app.enableCors();

  await app.listen(env.PORT);

  Logger.log(
    `Server is listening on port ${env.PORT}`,
    'Bootstrap',
  );
}

bootstrap();
