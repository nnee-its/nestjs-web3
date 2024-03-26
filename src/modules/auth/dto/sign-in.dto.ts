import { IsString } from "class-validator"

export class SignInDto {
  @IsString()
  signature: string

  @IsString()
  message: string
}
