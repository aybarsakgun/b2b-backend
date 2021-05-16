export type EnvVariables = Readonly<{
  APP_ENV: "dev" | "prod";

  PORT: number;

  // typeOrm
  TYPEORM_HOST: string;
  TYPEORM_PORT: number;
  TYPEORM_USERNAME: string;
  TYPEORM_PASSWORD: string;
  TYPEORM_DATABASE: string;

  // jwt
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;

  // redis

  REDIS_HOST: string;
  REDIS_PORT: number;
}>;
