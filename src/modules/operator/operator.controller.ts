import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Patch,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { Operator, OperatorRole } from "@prisma/client"
import { CurrentOperator } from "../auth/decorators/current-operator.decorator"
import { Roles } from "../auth/decorators/roles.decorator"
import { AccessTokenGuard } from "../auth/guards/jwt.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateOperatorRoleDto } from "./dto/update-operator-role.dto"

@ApiTags("Operator")
@ApiBearerAuth()
@UseGuards(AccessTokenGuard, RolesGuard)
@Controller("operator")
export class OperatorController {
  constructor(private prismaService: PrismaService) {}

  @Patch("role")
  @Roles(OperatorRole.SUPER_ADMIN)
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
