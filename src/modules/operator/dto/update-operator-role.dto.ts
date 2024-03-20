import { ApiProperty } from "@nestjs/swagger"
import { OperatorRole } from "@prisma/client"
import { IsEnum, IsEthereumAddress } from "class-validator"
import { Address } from "viem"

export class UpdateOperatorRoleDto {
  @IsEthereumAddress()
  walletAddress: Address

  @ApiProperty({
    enum: OperatorRole,
  })
  @IsEnum(OperatorRole)
  role: OperatorRole
}
