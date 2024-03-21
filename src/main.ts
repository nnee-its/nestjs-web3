import { ValidationPipe } from "@nestjs/common"
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
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  const swaggerConfig = new DocumentBuilder()
    .setTitle("NestJs Web3")
    .addBearerAuth()
    .build()
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup("docs", app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  await app.listen(configService.get("PORT"))
}
bootstrap()
