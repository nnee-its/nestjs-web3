import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SiweMessage } from "siwe"
import { exclude } from "src/utils/exclude"
import { PrismaService } from "../prisma/prisma.service"
import { AuthService } from "./auth.service"
import { SignInDto } from "./dto/sign-in.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private prismaService: PrismaService,
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
    const siweResponse = await siweMessage.verify({
      signature: data.signature,
    })
    if (!siweResponse.data) throw new UnauthorizedException()

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
}
