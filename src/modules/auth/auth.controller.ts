import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SiweMessage } from "siwe"
import { PrismaService } from "../prisma/prisma.service"
import { SignInDto } from "./dto/sign-in.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private prismaService: PrismaService) {}

  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    const siweMessage = new SiweMessage(data.message)
    const siweResponse = await siweMessage.verify({
      signature: data.signature,
    })
    if (siweResponse.data) {
      const { address } = siweResponse.data
      const operator = await this.prismaService.operator.findUnique({
        where: {
          walletAddress: address,
        },
      })
      if (operator) return operator
      return this.prismaService.operator.create({
        data: {
          walletAddress: address,
        },
      })
    } else throw new UnauthorizedException()
  }
}
