import Joi from "@hapi/joi";
import dotenv from "dotenv";

import { EnvVariables } from "./env.types";

export class EnvConfig {
  constructor() {
    dotenv.config();

    this.envConfig = this.validateEnvVariables(process.env);
  }

  readonly envConfig: EnvVariables;

  private validateEnvVariables = (
    env: dotenv.DotenvParseOutput
  ): EnvVariables => {
    const appEnvValidation = Joi.string()
      .valid("dev", "prod")
      .default("dev")
      .validate(env.APP_ENV);

    if (appEnvValidation.error) {
      throw new Error(
        `Config validation error: ${appEnvValidation.error.message}`
      );
    }

    const appEnv: EnvVariables["APP_ENV"] = appEnvValidation.value;

    const envVarsSchema: Joi.ObjectSchema<EnvVariables> = Joi.object({
      PORT: Joi.number().default(4000),

      // typeOrm
      TYPEORM_HOST: Joi.string().required(),
      TYPEORM_PORT: Joi.number().required(),
      TYPEORM_USERNAME: Joi.string().required(),
      TYPEORM_PASSWORD: Joi.string().allow("").required(),
      TYPEORM_DATABASE: Joi.string().required(),

      // jwt
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRES_IN: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(env, {
      stripUnknown: true,
    });

    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }

    const config = validatedEnvConfig as EnvVariables;

    return {
      ...config,
      APP_ENV: appEnv,
    };
  };
}
