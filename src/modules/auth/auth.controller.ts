import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from "@nestjs/common"
import { ApiOkResponse, ApiTags } from "@nestjs/swagger"
import { SiweMessage, generateNonce } from "siwe"
import { SignInDto } from "./dto/sign-in.dto"

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  @ApiOkResponse({
    schema: {
      example: "QWkDDa9Kf6igwGBms",
    },
  })
  @Get("nonce")
  getNonce() {
    return generateNonce()
  }

  @Post("sign-in")
  async signIn(@Body() data: SignInDto) {
    const siweMessage = new SiweMessage(data.message)
    const siweResponse = await siweMessage.verify({
      signature: data.signature,
    })
    if (siweResponse.data) {
      console.log(siweResponse.data)
    } else throw new UnauthorizedException()
  }
}
