import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
} from "@nestjs/common"
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger"
import { Operator } from "@prisma/client"
import { SiweMessage, SiweResponse } from "siwe"
import { exclude } from "src/utils/exclude"
import { PrismaService } from "../prisma/prisma.service"
import { AuthService } from "./auth.service"
import { CurrentOperator } from "./decorators/current-operator.decorator"
import { PublicRoute } from "./decorators/public-route.decorator"
import { SignInDto } from "./dto/sign-in.dto"
import { RefreshTokenGuard } from "./guards/jwt.guard"

@ApiTags("Auth")
@ApiBearerAuth()
@PublicRoute()
@Controller("auth")
export class AuthController {
  constructor(
    @Inject("PRISMA") private prismaService: PrismaService,
    private authService: AuthService,
  ) {}

  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    let siweMessage: SiweMessage
    try {
      siweMessage = new SiweMessage(data.message)
    } catch (error) {
      throw new BadRequestException("Invalid message")
    }

    let siweResponse: SiweResponse
    try {
      siweResponse = await siweMessage.verify({
        signature: data.signature,
      })
    } catch (error) {
      throw new BadRequestException("Invalid signature")
    }

    const { address } = siweResponse.data
    let operator = await this.prismaService.operator.findUnique({
      where: {
        walletAddress: address,
      },
    })
    const accessToken = this.authService.generateAccessToken(address)
    const refreshToken = this.authService.generateRefreshToken(address)

    if (operator)
      await this.prismaService.operator.update({
        where: {
          walletAddress: address,
        },
        data: {
          refreshToken,
        },
      })
    else
      operator = await this.prismaService.operator.create({
        data: {
          walletAddress: address,
          refreshToken,
        },
      })

    return {
      accessToken,
      refreshToken,
      operator: exclude(operator, ["refreshToken"]),
    }
  }

  @UseGuards(RefreshTokenGuard)
  @Get("refresh-token")
  async refreshToken(@CurrentOperator() operator: Operator) {
    const accessToken = this.authService.generateAccessToken(
      operator.walletAddress,
    )
    const refreshToken = this.authService.generateRefreshToken(
      operator.walletAddress,
    )
    await this.prismaService.operator.update({
      where: {
        walletAddress: operator.walletAddress,
      },
      data: {
        refreshToken,
      },
    })

    return {
      accessToken,
      refreshToken,
    }
  }
}
