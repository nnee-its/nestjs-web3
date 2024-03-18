import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { EnvPayload } from "./types/env-payload"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<EnvPayload>)

  app.enableShutdownHooks()
  app.enableCors()
  app.use(helmet())
  await app.listen(configService.get("PORT"))
}
bootstrap()
