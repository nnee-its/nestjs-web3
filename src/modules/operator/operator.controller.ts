import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Query,
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { Operator, OperatorRole, Prisma } from "@prisma/client"
import { paginationResponse } from "src/utils/response"
import { CurrentOperator } from "../auth/decorators/current-operator.decorator"
import { Roles } from "../auth/decorators/roles.decorator"
import { PrismaService } from "../prisma/prisma.service"
import { GetOperatorsDto } from "./dto/get-operators.dto"
import { UpdateOperatorRoleDto } from "./dto/update-operator-role.dto"

@ApiTags("Operator")
@ApiBearerAuth()
@Controller("operator")
export class OperatorController {
  constructor(@Inject("PRISMA") private prismaService: PrismaService) {}

  @Get()
  async getOperators(@Query() { page, take, keyword }: GetOperatorsDto) {
    const where: Prisma.OperatorWhereInput = {}
    if (keyword)
      where.OR = [
        {
          walletAddress: {
            contains: keyword,
          },
        },
        {
          name: {
            contains: keyword,
          },
        },
      ]

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.operator.findMany({
        where,
        skip: (page - 1) * take,
        take,
      }),
      this.prismaService.operator.count({ where }),
    ])
    return paginationResponse(data, total, page, take)
  }

  @Roles(OperatorRole.SUPER_ADMIN)
  @Patch("role")
  async updateOperatorRole(
    @Body() data: UpdateOperatorRoleDto,
    @CurrentOperator() operator: Operator,
  ) {
    if (operator.walletAddress === data.walletAddress)
      throw new BadRequestException("Invalid wallet address")
    const targetOperator = await this.prismaService.operator.findUnique({
      where: {
        walletAddress: data.walletAddress,
      },
    })
    if (!targetOperator) throw new NotFoundException("Wallet address not found")
    await this.prismaService.operator.update({
      where: {
        walletAddress: data.walletAddress,
      },
      data: {
        role: data.role,
      },
    })
    return "Updated operator role"
  }

  @Roles(OperatorRole.SUPER_ADMIN)
  @Delete(":walletAddress")
  async deleteOperator(
    @Param("walletAddress") walletAddress: string,
    @CurrentOperator() currentOperator: Operator,
  ) {
    if (currentOperator.walletAddress === walletAddress)
      throw new BadRequestException("Invalid wallet address")
    const operator = await this.prismaService.operator.findUnique({
      where: {
        walletAddress,
      },
    })
    if (!operator) throw new NotFoundException("Operator does not exist")

    await this.prismaService.operator.delete({
      where: {
        walletAddress,
      },
    })
    return "Deleted operator"
  }
}
