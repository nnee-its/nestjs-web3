import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { OperatorRole, Prisma } from "@prisma/client"
import { paginationResponse } from "src/utils/response"
import { Roles } from "../auth/decorators/roles.decorator"
import { AccessTokenGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { PrismaService } from "../prisma/prisma.service"
import { CreatePoolDto } from "./dto/create-pool.dto"
import { GetPoolsDto } from "./dto/get-pools.dto"
import { UpdatePoolDto } from "./dto/update-pool.dto"

@ApiTags("Pool")
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller("pool")
export class PoolController {
  constructor(private prismaService: PrismaService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @Get()
  async getPools(@Query() { page, take, keyword }: GetPoolsDto) {
    const where: Prisma.PoolWhereInput = {}
    if (keyword)
      where.OR = [
        {
          projectName: {
            contains: keyword,
          },
        },
        {
          tokenName: {
            contains: keyword,
          },
        },
      ]

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.pool.findMany({
        where,
        skip: (page - 1) * take,
        take,
      }),
      this.prismaService.pool.count({
        where,
      }),
    ])
    return paginationResponse(data, total, page, take)
  }

  @Get(":poolId")
  async getPool(@Param("poolId", ParseUUIDPipe) poolId: string) {
    const pool = await this.prismaService.pool.findUnique({
      where: {
        id: poolId,
      },
    })
    if (!pool) throw new NotFoundException("Pool does not exist")
    return pool
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(OperatorRole.SUPER_ADMIN, OperatorRole.ADMIN, OperatorRole.EDITOR)
  @Patch(":poolId")
  async updatePool(
    @Param("poolId", ParseUUIDPipe) poolId: string,
    @Body() data: UpdatePoolDto,
  ) {
    const pool = await this.prismaService.pool.update({
      where: {
        id: poolId,
      },
      data: {
        ...data,
        socials: JSON.stringify(data.socials),
      },
    })
    if (!pool) throw new NotFoundException("Pool does not exist")
    return "Updated pool"
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @Roles(OperatorRole.SUPER_ADMIN, OperatorRole.ADMIN, OperatorRole.EDITOR)
  @Delete(":poolId")
  async deletePool(@Param("poolId", ParseUUIDPipe) poolId: string) {
    const pool = await this.prismaService.pool.delete({
      where: {
        id: poolId,
      },
    })
    if (!pool) throw new NotFoundException("Pool does not exist")
    return "Deleted pool"
  }
}
