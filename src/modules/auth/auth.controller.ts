import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common"
import { ApiTags } from "@nestjs/swagger"
import { SiweMessage } from "siwe"
import { SignInDto } from "./dto/sign-in.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    const siweMessage = new SiweMessage(data.message)
    const siweResponse = await siweMessage.verify({ signature: data.signature })
    if (siweResponse.success) {
    } else throw new UnauthorizedException()
  }
}
