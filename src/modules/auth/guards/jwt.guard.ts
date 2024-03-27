import { ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { AuthGuard } from "@nestjs/passport"

@Injectable()
export class AccessTokenGuard extends AuthGuard("access-token") {
  constructor(private reflector: Reflector) {
    super()
  }

  canActivate(context: ExecutionContext) {
    const publicRoute = this.reflector.getAllAndOverride("publicRoute", [
      context.getHandler(),
      context.getClass(),
    ])
    if (publicRoute) return true
    return super.canActivate(context)
  }
}

@Injectable()
export class RefreshTokenGuard extends AuthGuard("refresh-token") {}
