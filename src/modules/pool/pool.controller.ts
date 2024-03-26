import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { OperatorRole } from "@prisma/client"
import { Roles } from "../auth/decorators/roles.decorator"
import { AccessTokenGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { PrismaService } from "../prisma/prisma.service"
import { CreatePoolDto } from "./dto/create-pool.dto"

@ApiTags("Pool")
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller("pool")
export class PoolController {
  constructor(private prismaService: PrismaService) {}

  @Roles(OperatorRole.SUPER_ADMIN, OperatorRole.ADMIN, OperatorRole.EDITOR)
  @Post()
  createPool(@Body() data: CreatePoolDto) {
    return this.prismaService.pool.create({
      data: {
        ...data,
        socials: JSON.stringify(data.socials),
      },
    })
  }
}
