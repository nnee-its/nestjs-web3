import { IsNotEmpty, IsString, IsUrl } from "class-validator"

export class PoolSocial {
  @IsString()
  @IsNotEmpty()
  type: string

  @IsUrl()
  url: string
}
