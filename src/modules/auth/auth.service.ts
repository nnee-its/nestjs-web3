import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { EnvPayload } from "src/types/env-payload"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService<EnvPayload>,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  generateAccessToken(walletAddress: string) {
    return this.jwtService.sign(
      {
        walletAddress,
      },
      {
        secret: this.configService.get("ACCESS_TOKEN_SECRET"),
        expiresIn: this.configService.get("ACCESS_TOKEN_EXPIRE"),
      },
    )
  }

  generateRefreshToken(walletAddress: string) {
    return this.jwtService.sign(
      {
        walletAddress,
      },
      {
        secret: this.configService.get("REFRESH_TOKEN_SECRET"),
        expiresIn: this.configService.get("REFRESH_TOKEN_EXPIRE"),
      },
    )
  }
}
