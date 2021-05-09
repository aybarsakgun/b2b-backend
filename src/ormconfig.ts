import path from "path";
import { ConnectionOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import { env } from "./common/env";

const typeOrmConfig: ConnectionOptions = {
  type: "mysql",
  host: env.TYPEORM_HOST,
  port: env.TYPEORM_PORT,
  username: env.TYPEORM_USERNAME,
  password: env.TYPEORM_PASSWORD,
  database: env.TYPEORM_DATABASE,
  synchronize: env.APP_ENV === "dev",
  entities: [path.resolve(__dirname, "**/*.model{.ts,.js}")],
  migrations: [path.resolve(__dirname, "common/migrations/*{.ts,.js}")],
  subscribers: [path.resolve(__dirname, "**/*.subscriber{.ts,.js}")],
  migrationsRun: env.APP_ENV === "prod",
  cli: {
    migrationsDir: "src/common/migrations",
  },
  namingStrategy: new SnakeNamingStrategy(),
};

export = typeOrmConfig;
