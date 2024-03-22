import { INestApplication } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { Test } from "@nestjs/testing"
import { AuthService } from "src/modules/auth/auth.service"
import { PrismaModule } from "src/modules/prisma/prisma.module"
import * as request from "supertest"
import { AuthModule } from "../../src/modules/auth/auth.module"

describe("AuthModule", () => {
  let app: INestApplication
  let authService: AuthService
  const validSignInData = {
    signature:
      "0x0fcb209d14036d070c8d69e62366c9a227e25819b0201d030e1b41c147d066b66b3290826b59ce3c09c3dd71eed592f15162b71b3e387a8baf6ab843cab2bf981b",
    message:
      "localhost:5173 wants you to sign in with your Ethereum account:\n0xB20f5E5e12912E6756604AC9057dA635eC985de1\n\nSign in with Ethereum to the app.\n\nURI: http://localhost:5173\nVersion: 1\nChain ID: 1\nNonce: eyTVCjVOm868Vtozn\nIssued At: 2024-03-22T04:08:12.306Z",
  }

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    authService = app.get(AuthService)
    await app.init()
  })

  describe("POST /auth/sign-in", () => {
    it("should throw bad request (empty data)", () =>
      request(app.getHttpServer()).post("/auth/sign-in").send({}).expect(400))
    it("should throw bad request (invalid data)", () =>
      request(app.getHttpServer())
        .post("/auth/sign-in")
        .send({
          signature:
            "0x4c4bcce8b024a18c3fa155f326818358206125c2b1230f88a4bd26d8b43b54d541bb552a9d5d69923f5dccb46814203c8ace75cdf6b71890fb3fd76e39b8931f1c",
          message:
            "localhost:5173 wants you to sign in with your Ethereum account:\n0xB20f5E5e12912E6756604AC9057dA635eC985de1\n\nSign in with Ethereum to the app.\n\nURI: http://localhost:5173\nVersion: 1\nChain ID: 1\nNonce: eyTVCjVOm868Vtozn\nIssued At: 2024-03-22T04:08:12.306Z",
        })
        .expect(400))
    it("should return success (valid data)", () =>
      request(app.getHttpServer())
        .post("/auth/sign-in")
        .send(validSignInData)
        .expect(201))
  })

  describe("GET /refresh-token", () => {
    it("should throw unauthorized (empty refresh token)", () =>
      request(app.getHttpServer()).get("/auth/refresh-token").expect(401))
    it("should throw unauthorized (invalid refresh token)", () =>
      request(app.getHttpServer())
        .get("/auth/refresh-token")
        .auth(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ3YWxsZXRBZGRyZXNzIjoiMHg3MThkNUQzRUZDZTMwQzA0RDk2MEREOERkZUMxNjZjMDQzNDlhYjMwIiwiaWF0IjoxNzExMDA3ODg4LCJleHAiOjE3MTM1OTk4ODh9.7MvQLbtpU60jd5Mk1r535Hdj7TJ3eMfo98dljepR0ls",
          {
            type: "bearer",
          },
        )
        .expect(401))
    it("should return success (valid refresh token)", () => {
      const refreshToken = authService.generateRefreshToken(
        "0xB20f5E5e12912E6756604AC9057dA635eC985de1",
      )
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
