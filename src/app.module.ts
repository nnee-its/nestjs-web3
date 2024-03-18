import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import * as Joi from "joi"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { EnvPayload } from "./types/env-payload"
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object<EnvPayload, true>({
        NODE_ENV: Joi.string().required().valid("development", "production"),
        PORT: Joi.number().port().required(),

        DB_URL: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().port().required(),
      }),
    }),
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
