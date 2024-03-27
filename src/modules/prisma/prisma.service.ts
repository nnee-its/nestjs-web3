import { OnModuleInit } from "@nestjs/common"
import { PrismaClient } from "@prisma/client"

class BasePrismaClient extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect()
  }
}

export const prismaService = new BasePrismaClient().$extends({
  result: {
    pool: {
      socials: {
        needs: {
          socials: true,
        },
        compute(data) {
          return JSON.parse(data.socials as string)
        },
      },
    },
  },
})

export type PrismaService = typeof prismaService
