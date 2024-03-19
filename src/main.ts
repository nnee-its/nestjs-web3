import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import helmet from "helmet"
import { AppModule } from "./app.module"
import { EnvPayload } from "./types/env-payload"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService<EnvPayload>)

  app.enableShutdownHooks()
  app.enableCors()
  app.use(helmet())

  const swaggerConfig = new DocumentBuilder().setTitle("NestJs Web3").build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("docs", app, swaggerDocument)

  await app.listen(configService.get("PORT"))
}
bootstrap()
