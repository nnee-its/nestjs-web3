import { ApiProperty } from "@nestjs/swagger"
import { OperatorRole } from "@prisma/client"
import { IsEnum } from "class-validator"

export class UpdateOperatorRoleDto {
  @ApiProperty({
    enum: OperatorRole,
  })
  @IsEnum(OperatorRole)
  role: OperatorRole
}
