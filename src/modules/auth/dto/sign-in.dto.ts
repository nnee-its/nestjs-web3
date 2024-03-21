import { IsHexadecimal, IsString } from "class-validator"

export class SignInDto {
  @IsString()
  signature: string

  @IsHexadecimal()
  message: string
}
