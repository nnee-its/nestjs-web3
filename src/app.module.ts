import { CacheModule } from "@nestjs/cache-manager"
import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import * as redisStore from "cache-manager-redis-store"
import * as Joi from "joi"
import { AuthModule } from "./modules/auth/auth.module"
import { AccessTokenGuard } from "./modules/auth/guards/jwt.guard"
import { RolesGuard } from "./modules/auth/guards/roles.guard"
import { ClientModule } from "./modules/client/client.module"
import { OperatorModule } from "./modules/operator/operator.module"
import { PoolModule } from "./modules/pool/pool.module"
import { PrismaModule } from "./modules/prisma/prisma.module"
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

        WALLET_CLIENT_PRIVATE_KEY: Joi.string().required(),

        ACCESS_TOKEN_SECRET: Joi.string().required(),
        ACCESS_TOKEN_EXPIRE: Joi.string().required(),
        REFRESH_TOKEN_SECRET: Joi.string().required(),
        REFRESH_TOKEN_EXPIRE: Joi.string().required(),
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
    ClientModule,
    AuthModule,
    OperatorModule,
    PoolModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
