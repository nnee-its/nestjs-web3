import { IsEthereumAddress, IsString } from "class-validator"

export class SignInDto {
  @IsEthereumAddress()
  walletAddress: string

  @IsString()
  signature: string

  @IsString()
  message: string
}
