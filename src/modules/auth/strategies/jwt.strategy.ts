import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { PrismaService } from "src/modules/prisma/prisma.service"
import { EnvPayload } from "src/types/env-payload"
import { JwtPayload } from "src/types/jwt-payload"
import { RequestWithOperator } from "src/types/request"

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  "access-token",
) {
  constructor(
    private configService: ConfigService<EnvPayload>,
    @Inject("PRISMA") private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("ACCESS_TOKEN_SECRET"),
      passReqToCallback: true,
    })
  }

  async validate(request: RequestWithOperator, payload: JwtPayload) {
    const operator = await this.prismaService.operator.findUnique({
      where: {
        walletAddress: payload.walletAddress,
      },
    })

    request.operator = operator
    return operator
  }
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "refresh-token",
) {
  constructor(
    private configService: ConfigService<EnvPayload>,
    @Inject("PRISMA") private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    })
  }

  async validate(request: RequestWithOperator, payload: JwtPayload) {
    const operator = await this.prismaService.operator.findUnique({
      where: {
        walletAddress: payload.walletAddress,
      },
    })
    const refreshToken = request.headers["authorization"]
      .replace("Bearer", "")
      .trim()

    if (!operator) return null
    if (operator.refreshToken !== refreshToken) return null
    request.operator = operator
    return operator
  }
}
