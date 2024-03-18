import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import * as Joi from "joi"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { EnvPayload } from "./types/env-payload"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationOptions: Joi.object<EnvPayload, true>({
        NODE_ENV: Joi.string().required().valid("development", "production"),
        PORT: Joi.number().port().required(),

        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().port().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_URL: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().port().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
