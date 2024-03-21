import { IsHexadecimal, IsString } from "class-validator"

export class SignInDto {
  @IsHexadecimal()
  signature: string

  @IsString()
  message: string
}
