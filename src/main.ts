import { ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { env } from "./common/env";
import { JwtAuthGuard } from "./common/guards";
import { helmetMiddleware, rateLimitMiddleware } from "./common/middlewares";

const validationPipe = new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
});

async function bootstrap() {
  // await seed();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmetMiddleware);
  app.use(rateLimitMiddleware);

  app.enableCors();

  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(validationPipe);

  await app.listen(env.PORT);
}

bootstrap();
