import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import { join } from "path";

import { AuthModule } from "./auth/auth.module";
import { env } from "./common/env";
import typeOrmConfig from "./ormconfig";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      introspection: true,
      playground: env.APP_ENV !== "prod",
      context: ({ req }) => ({ req }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "client", "build"),
      exclude: ["/auth/*", "/graphql"],
    }),
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}
