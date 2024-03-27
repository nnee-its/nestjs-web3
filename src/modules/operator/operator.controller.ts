import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  NotFoundException,
  Patch,
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { Operator, OperatorRole } from "@prisma/client"
import { CurrentOperator } from "../auth/decorators/current-operator.decorator"
import { Roles } from "../auth/decorators/roles.decorator"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateOperatorRoleDto } from "./dto/update-operator-role.dto"

@ApiTags("Operator")
@ApiBearerAuth()
@Controller("operator")
export class OperatorController {
  constructor(@Inject("PRISMA") private prismaService: PrismaService) {}

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
}
