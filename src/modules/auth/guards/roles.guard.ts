import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { OperatorRole } from "@prisma/client"
import { RequestWithOperator } from "src/types/request"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<OperatorRole[]>(
      "roles",
      context.getHandler(),
    )
    if (!roles) return true

    const request = context.switchToHttp().getRequest<RequestWithOperator>()
    return roles.includes(request.operator.role)
  }
}
