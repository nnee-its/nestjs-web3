import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  UseGuards,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { Operator, OperatorRole } from "@prisma/client"
import { CurrentOperator } from "../auth/decorators/current-operator.decorator"
import { Roles } from "../auth/decorators/roles.decorator"
import { AccessTokenGuard } from "../auth/guards/jwt.guard"
import { PrismaService } from "../prisma/prisma.service"
import { UpdateOperatorRoleDto } from "./dto/update-operator-role.dto"

@ApiTags("Operator")
@UseGuards(AccessTokenGuard)
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
      throw new BadRequestException()
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
