import {MiddlewareConsumer, Module, NestModule, RequestMethod, ValidationPipe} from "@nestjs/common";
import {GraphQLModule} from "@nestjs/graphql";
import {ServeStaticModule} from "@nestjs/serve-static";
import {TypeOrmModule} from "@nestjs/typeorm";
import {join} from "path";
import {AuthModule} from "./auth/auth.module";
import {env} from "./common/env";
import typeOrmConfig from "./ormconfig";
import {UserModule} from "./users/user.module";
import {TransferModule} from "./transfer/transfer.module";
import {APP_FILTER, APP_GUARD, APP_PIPE} from "@nestjs/core";
import {AuthGuard} from "./common/guards";
import {AnyExceptionFilter} from "./common/filters/exception.filter";
import {ProductModule} from "./product/product.module";
import {AuthMiddleware} from "./common/middlewares/auth.middleware";
import {SettingModule} from "./setting/setting.module";
import {CurrencyModule} from "./currency/currency.module";
import {CartModule} from "./cart/cart.module";

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    }
  ],
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      introspection: true,
      playground: env.APP_ENV !== "prod",
      debug: env.APP_ENV !== "prod",
      installSubscriptionHandlers: true,
      subscriptions: {
        keepAlive: 20000
      },
      context: ({req, res}) => ({req, res}),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "client", "build"),
      exclude: ["/auth/*", "/graphql"],
    }),
    AuthModule,
    UserModule,
    TransferModule,
    ProductModule,
    SettingModule,
    CurrencyModule,
    CartModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({path: '*', method: RequestMethod.ALL});
  }
}
