import {Module, ValidationPipe} from "@nestjs/common";
import {GraphQLModule} from "@nestjs/graphql";
import {ServeStaticModule} from "@nestjs/serve-static";
import {TypeOrmModule} from "@nestjs/typeorm";
import {join} from "path";
import {AuthModule} from "./auth/auth.module";
import {env} from "./common/env";
import typeOrmConfig from "./ormconfig";
import {UsersModule} from "./users/users.module";
import {TransferModule} from "./transfer/transfer.module";
import {APP_FILTER, APP_GUARD, APP_PIPE} from "@nestjs/core";
import {JwtAuthGuard} from "./common/guards";
import {AnyExceptionFilter} from "./common/filters/exception.filter";
import {ProductModule} from "./product/product.module";

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
          enableImplicitConversion: true
        }
      })
    },
    {
      provide: APP_FILTER,
      useClass: AnyExceptionFilter
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      introspection: true,
      playground: env.APP_ENV !== 'prod',
      debug: env.APP_ENV !== 'prod',
      context: ({req, res}) => ({req, res}),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "client", "build"),
      exclude: ["/auth/*", "/graphql"],
    }),
    AuthModule,
    UsersModule,
    TransferModule,
    ProductModule
  ],
})
export class AppModule {
}
