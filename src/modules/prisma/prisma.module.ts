import { Global, Module } from "@nestjs/common"
import { prismaService } from "./prisma.service"

@Global()
@Module({
  providers: [
    {
      provide: "PRISMA",
      useFactory: () => prismaService,
    },
  ],
  exports: ["PRISMA"],
})
export class PrismaModule {}
