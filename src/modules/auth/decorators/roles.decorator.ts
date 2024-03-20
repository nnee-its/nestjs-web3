import { SetMetadata } from "@nestjs/common"
import { OperatorRole } from "@prisma/client"

export const Roles = (...roles: OperatorRole[]) => SetMetadata("roles", roles)
