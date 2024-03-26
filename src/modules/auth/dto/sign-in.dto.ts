import { IsNotEmpty, IsString } from "class-validator"

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  signature: string

  @IsString()
  @IsNotEmpty()
  message: string
}
