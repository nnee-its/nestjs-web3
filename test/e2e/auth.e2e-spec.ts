import { INestApplication } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { Test } from "@nestjs/testing"
import { Operator } from "@prisma/client"
import { SiweMessage } from "siwe"
import { AuthService } from "src/modules/auth/auth.service"
import { PrismaModule } from "src/modules/prisma/prisma.module"
import { PrismaService } from "src/modules/prisma/prisma.service"
import { EnvPayload } from "src/types/env-payload"
import * as request from "supertest"
import { privateKeyToAccount } from "viem/accounts"
import { AuthModule } from "../../src/modules/auth/auth.module"

describe("Auth endpoint", () => {
  let app: INestApplication,
    configService: ConfigService<EnvPayload>,
    authService: AuthService

  let operator: Operator = {
    walletAddress: "test",
    createdAt: new Date(),
    updatedAt: new Date(),
    email: "",
    name: "",
    role: "VIEWER",
    refreshToken: "",
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PrismaModule,
        AuthModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useValue({
        operator: {
          create: jest.fn().mockResolvedValue(operator),
          findUnique: jest.fn().mockResolvedValue(operator),
          update: jest.fn().mockResolvedValue(operator),
        },
      })
      .compile()

    app = moduleRef.createNestApplication()
    authService = moduleRef.get(AuthService)
    configService = moduleRef.get(ConfigService)

    await app.init()
  })

  describe("POST /auth/sign-in", () => {
    let signInData = {
      signature: "",
      message: "",
    }

    beforeEach(async () => {
      const account = privateKeyToAccount(
        configService.get("WALLET_CLIENT_PRIVATE_KEY"),
      )
      signInData.message = new SiweMessage({
        address: account.address,
        chainId: 1,
        domain: "web3",
        uri: "http://localhost",
        statement: "Sign in with Ethereum to the app.",
        version: "1",
      }).prepareMessage()
      signInData.signature = await account.signMessage({
        message: signInData.message,
      })
    })

    describe("send invalid data", () => {
      it("empty data", () =>
        request(app.getHttpServer())
          .post("/auth/sign-in")
          .send({
            signature: "",
            message: "",
          })
          .expect(400))
      it("invalid message", () =>
        request(app.getHttpServer())
          .post("/auth/sign-in")
          .send({
            signature: signInData.signature,
            message: "",
          })
          .expect(400)
          .expect((res) => expect(res.body.message).toEqual("Invalid message")))
      it("invalid signature", () =>
        request(app.getHttpServer())
          .post("/auth/sign-in")
          .send({
            signature: "",
            message: signInData.message,
          })
          .expect(400)
          .expect((res) =>
            expect(res.body.message).toEqual("Invalid signature"),
          ))
    })

    describe("send valid data", () => {
      it("wallet address does not exist", () =>
        request(app.getHttpServer())
          .post("/auth/sign-in")
          .send(signInData)
          .expect(201))
    })
  })

  describe("GET /refresh-token", () => {
    it("without refresh token", () =>
      request(app.getHttpServer()).get("/auth/refresh-token").expect(401))

    it("with refresh token", () => {
      const refreshToken = authService.generateRefreshToken("test")
      operator.refreshToken = refreshToken

      return request(app.getHttpServer())
        .get("/auth/refresh-token")
        .auth(refreshToken, {
          type: "bearer",
        })
        .expect(200)
    })
  })

  afterAll(async () => {
    await app.close()
  })
})
