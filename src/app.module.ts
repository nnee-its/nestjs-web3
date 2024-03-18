import { CacheModule } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import * as redisStore from "cache-manager-redis-store"
import * as Joi from "joi"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { PrismaModule } from "./prisma/prisma.module"
import { EnvPayload } from "./types/env-payload"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object<EnvPayload, true>({
        NODE_ENV: Joi.string().required().valid("development", "production"),
        PORT: Joi.number().port().required(),

        DATABASE_URL: Joi.string().required(),

        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().port().required(),
      }),
    }),
    PrismaModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory(configService: ConfigService<EnvPayload>) {
        return {
          isGlobal: true,
          store: redisStore,
          host: configService.get("REDIS_HOST"),
          port: configService.get("REDIS_PORT"),
        }
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
